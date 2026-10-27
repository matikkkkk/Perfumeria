package cl.luxury.ordenes.service;

import cl.luxury.ordenes.dto.OrdenRequest;
import cl.luxury.ordenes.exception.NoEncontradoException;
import cl.luxury.ordenes.exception.SolicitudInvalidaException;
import cl.luxury.ordenes.model.Cliente;
import cl.luxury.ordenes.model.Envio;
import cl.luxury.ordenes.model.Orden;
import cl.luxury.ordenes.model.OrdenItem;
import cl.luxury.ordenes.model.Pago;
import cl.luxury.ordenes.repository.OrdenRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class OrdenService {

    static final String PAGADO = "Pagado";
    static final String PAGO_FALLIDO = "Pago fallido";
    private static final Set<String> ESTADOS = Set.of("Pendiente", PAGADO, PAGO_FALLIDO, "En preparación", "Enviado", "Entregado");
    /** Campos por los que se puede ordenar (?_sort=fecha&_order=desc, como json-server). */
    private static final Set<String> ORDENABLES = Set.of("id", "fecha", "estado", "subtotal", "descuento", "total");
    private static final long MAXIMO_IMPORTE = Integer.MAX_VALUE;

    private final OrdenRepository ordenes;
    private final ApplicationEventPublisher eventos;

    public OrdenService(OrdenRepository ordenes, ApplicationEventPublisher eventos) {
        this.ordenes = ordenes;
        this.eventos = eventos;
    }

    /**
     * Filtros opcionales: ?usuarioId=<run> (historial de compras), ?estado=Pagado.
     * Orden: ?_sort=fecha&_order=desc (por defecto, id ascendente).
     */
    @Transactional(readOnly = true)
    public List<Orden> listar(Map<String, String> filtros) {
        Specification<Orden> spec = (root, query, cb) -> cb.conjunction();

        String usuarioId = filtros.get("usuarioId");
        if (usuarioId != null) {
            final String run = normalizarRun(usuarioId);
            spec = spec.and((root, query, cb) -> cb.equal(root.get("usuarioId"), run));
        }
        String estado = filtros.get("estado");
        if (estado != null) {
            final String valor = estado.trim().toLowerCase();
            spec = spec.and((root, query, cb) -> cb.equal(cb.lower(root.get("estado")), valor));
        }

        String campo = filtros.getOrDefault("_sort", "id");
        if (!ORDENABLES.contains(campo)) {
            throw new SolicitudInvalidaException("No se puede ordenar por '" + campo + "'. Campos válidos: " + ORDENABLES);
        }
        String sentido = filtros.getOrDefault("_order", "asc");
        if (!sentido.equalsIgnoreCase("asc") && !sentido.equalsIgnoreCase("desc")) {
            throw new SolicitudInvalidaException("_order debe ser asc o desc.");
        }
        Sort.Direction direccion = Sort.Direction.fromString(sentido);
        // el id desempata cuando dos órdenes tienen la misma fecha
        Sort orden = campo.equals("id") ? Sort.by(direccion, "id") : Sort.by(direccion, campo).and(Sort.by(direccion, "id"));
        return ordenes.findAll(spec, orden);
    }

    @Transactional(readOnly = true)
    public Orden obtener(Long id) {
        return ordenes.findById(id).orElseThrow(() -> new NoEncontradoException("No existe la orden " + id));
    }

    @Transactional
    public Orden crear(OrdenRequest solicitud) {
        Orden orden = new Orden();
        aplicar(orden, solicitud);
        Orden guardada = ordenes.save(orden);
        if (PAGADO.equals(guardada.getEstado())) {
            eventos.publishEvent(new OrdenPagadaEvento(guardada.getId()));
        }
        return guardada;
    }

    /** Reemplaza la orden completa (conserva el id). */
    @Transactional
    public Orden actualizar(Long id, OrdenRequest solicitud) {
        Orden orden = obtener(id);
        boolean pagadaAntes = PAGADO.equals(orden.getEstado());
        aplicar(orden, solicitud);
        Orden guardada = ordenes.save(orden);
        if (!pagadaAntes && PAGADO.equals(guardada.getEstado())) {
            eventos.publishEvent(new OrdenPagadaEvento(guardada.getId()));
        }
        return guardada;
    }

    /**
     * PATCH: por ahora solo se puede cambiar el estado (flujo del checkout: Pendiente -> Pagado / Pago fallido).
     * Al pasar a Pagado el total se recalcula como subtotal - descuento (un pago fallido guarda total 0).
     */
    @Transactional
    public Orden modificar(Long id, JsonNode cambios) {
        Orden orden = obtener(id);
        if (cambios == null || !cambios.hasNonNull("estado")) {
            throw new SolicitudInvalidaException("El cuerpo debe incluir 'estado'. Solo se puede modificar el estado.");
        }
        String estado = cambios.get("estado").asText();
        if (!ESTADOS.contains(estado)) {
            throw new SolicitudInvalidaException("Estado inválido. Valores: " + ESTADOS);
        }
        String anterior = orden.getEstado();
        if (anterior.equals(estado)) return orden; // evitar notificaciones repetidas
        boolean pagadaAntes = PAGADO.equals(anterior);
        // No permitir que las compras fallidas avancen al despacho ni retroceder etapas.
        List<String> flujo = List.of(PAGADO, "En preparación", "Enviado", "Entregado");
        if (flujo.contains(estado) && !PAGADO.equals(estado)) {
            if (!flujo.contains(anterior) || flujo.indexOf(estado) != flujo.indexOf(anterior) + 1) {
                throw new SolicitudInvalidaException("Transición no permitida: " + anterior + " → " + estado);
            }
        }
        if (flujo.contains(anterior) &&
                (!flujo.contains(estado) || flujo.indexOf(estado) < flujo.indexOf(anterior))) {
            throw new SolicitudInvalidaException("No se puede retroceder un pedido en despacho.");
        }
        orden.setEstado(estado);
        if (PAGADO.equals(estado)) {
            orden.setTotal(orden.getSubtotal() - orden.getDescuento());
        }
        Orden guardada = ordenes.save(orden);
        if (!pagadaAntes && PAGADO.equals(guardada.getEstado())) {
            eventos.publishEvent(new OrdenPagadaEvento(guardada.getId()));
        } else if (Set.of("En preparación", "Enviado", "Entregado").contains(estado)) {
            eventos.publishEvent(new OrdenEstadoActualizadoEvento(guardada.getId(), estado));
        }
        return guardada;
    }

    @Transactional
    public void eliminar(Long id) {
        ordenes.delete(obtener(id));
    }

    // ------------------------------------------------------------------ reglas de negocio

    private void aplicar(Orden destino, OrdenRequest r) {
        // 1) Subtotales de cada línea y de la orden: se recalculan, y si el cliente envió otro valor, es un error.
        long suma = 0;
        for (OrdenRequest.ItemDto i : r.items()) {
            long subtotalItem = (long) i.precio() * i.cantidad();
            if (i.subtotal() != null && i.subtotal() != subtotalItem) {
                throw new SolicitudInvalidaException("El subtotal de '" + i.nombre() + "' no coincide con precio x cantidad.");
            }
            suma += subtotalItem;
        }
        if (suma > MAXIMO_IMPORTE) {
            throw new SolicitudInvalidaException("El importe de la orden es demasiado alto.");
        }
        if (r.subtotal() != null && r.subtotal() != suma) {
            throw new SolicitudInvalidaException("El subtotal de la orden no coincide con la suma de sus productos.");
        }

        // 2) Descuento y total. Un pago fallido puede quedar con total 0 (así lo envía el checkout).
        int subtotal = (int) suma;
        int descuento = r.descuento() == null ? 0 : r.descuento();
        if (descuento > subtotal) {
            throw new SolicitudInvalidaException("El descuento no puede superar el subtotal.");
        }
        int esperado = subtotal - descuento;
        int total = r.total() == null ? esperado : r.total();
        if (total > subtotal) {
            throw new SolicitudInvalidaException("El total no puede superar el subtotal.");
        }
        if (!PAGO_FALLIDO.equals(r.estado()) && total != esperado) {
            throw new SolicitudInvalidaException("El total debe ser subtotal - descuento (" + esperado + ").");
        }

        // 3) Copiar los datos a la entidad
        destino.setFecha(r.fecha() != null ? r.fecha() : Instant.now());
        destino.setEstado(r.estado());
        String run = vacioANulo(r.usuarioId()) == null ? null : normalizarRun(r.usuarioId());
        if (run != null && run.length() > 9) {
            throw new SolicitudInvalidaException("usuarioId no es un RUN válido.");
        }
        destino.setUsuarioId(run);

        Cliente cliente = new Cliente();
        cliente.setNombre(r.cliente().nombre().trim());
        cliente.setApellidos(r.cliente().apellidos().trim());
        cliente.setCorreo(r.cliente().correo().trim().toLowerCase());
        destino.setCliente(cliente);

        Envio envio = new Envio();
        envio.setCalle(r.envio().calle().trim());
        envio.setDepartamento(textoOVacio(r.envio().departamento()));
        envio.setRegion(r.envio().region().trim());
        envio.setComuna(r.envio().comuna().trim());
        envio.setIndicaciones(textoOVacio(r.envio().indicaciones()));
        destino.setEnvio(envio);

        // orphanRemoval borra las líneas anteriores al reemplazar (PUT)
        destino.getItems().clear();
        for (OrdenRequest.ItemDto i : r.items()) {
            OrdenItem item = new OrdenItem();
            item.setProductoId(i.productoId().trim());
            item.setCodigo(i.codigo());
            item.setNombre(i.nombre());
            item.setMarca(i.marca());
            item.setImagen(i.imagen());
            item.setPrecio(i.precio());
            item.setCantidad(i.cantidad());
            item.setSubtotal(i.precio() * i.cantidad());
            destino.getItems().add(item);
        }

        destino.setSubtotal(subtotal);
        destino.setCupon(vacioANulo(r.cupon()));
        destino.setDescuento(descuento);
        destino.setTotal(total);

        Pago pago = new Pago();
        pago.setMetodo(r.pago().metodo().trim());
        pago.setTarjetaFinal(r.pago().tarjetaFinal());
        destino.setPago(pago);
    }

    /** RUN sin puntos, guion ni espacios y con la K en mayúscula (así se guarda en ms-usuarios). */
    static String normalizarRun(String run) {
        return run.replaceAll("[.\\-\\s]", "").toUpperCase();
    }

    private static String vacioANulo(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }

    private static String textoOVacio(String texto) {
        return texto == null ? "" : texto.trim();
    }
}
