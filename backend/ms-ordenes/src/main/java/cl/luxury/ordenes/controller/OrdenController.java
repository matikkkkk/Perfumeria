package cl.luxury.ordenes.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import cl.luxury.ordenes.dto.OrdenRequest;
import cl.luxury.ordenes.model.Orden;
import cl.luxury.ordenes.service.OrdenService;
import cl.luxury.ordenes.service.BoletaPdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;
import java.util.Map;

@Tag(name = "Orden", description = "Operaciones del recurso orden en el microservicio órdenes.")
@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    private final OrdenService servicio;
    private final BoletaPdfService boletaPdfService;

    public OrdenController(OrdenService servicio, BoletaPdfService boletaPdfService) {
        this.servicio = servicio;
        this.boletaPdfService = boletaPdfService;
    }

    /** Descarga del comprobante de una orden pagada (demo académica sin autenticación de API). */
    @Operation(summary = "Descargar boleta PDF", description = "GET del recurso orden.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @GetMapping(value = "/{id}/boleta", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> descargarBoleta(@PathVariable Long id) {
        Orden orden = servicio.obtener(id);
        if (!java.util.Set.of("Pagado", "En preparación", "Enviado", "Entregado").contains(orden.getEstado())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Solo hay boletas para compras confirmadas.");
        }
        try {
            byte[] pdf = boletaPdfService.generar(orden);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=boleta-luxury-" + id + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(pdf.length)
                    .body(pdf);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo generar la boleta.", ex);
        }
    }

    /** GET /api/ordenes?usuarioId=20987654K&_sort=fecha&_order=desc  (historial de compras / listado admin) */
    @Operation(summary = "Listar registros", description = "GET del recurso orden.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Lista obtenida (puede estar vacía)")})
    @GetMapping
    public List<Orden> listar(@RequestParam Map<String, String> filtros) {
        return servicio.listar(filtros);
    }

    /** Comprobación rápida: GET http://localhost:8083/api/ordenes/salud (la ruta literal gana a /{id}). */
    @Operation(summary = "Comprobar estado del servicio", description = "GET del recurso orden.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente")})
    @GetMapping("/salud")
    public Map<String, String> salud() {
        return Map.of("servicio", "ms-ordenes", "estado", "OK");
    }

    @Operation(summary = "Consultar registro por identificador", description = "GET del recurso orden.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @GetMapping("/{id}")
    public Orden obtener(@PathVariable Long id) {
        return servicio.obtener(id);
    }

    @Operation(summary = "Crear registro", description = "POST del recurso orden.")
    @ApiResponses({@ApiResponse(responseCode = "201", description = "Recurso creado"), @ApiResponse(responseCode = "400", description = "Solicitud inválida"), @ApiResponse(responseCode = "409", description = "Conflicto con el estado del recurso")})
    @PostMapping
    public ResponseEntity<Orden> crear(@Valid @RequestBody OrdenRequest solicitud) {
        Orden creada = servicio.crear(solicitud);
        return ResponseEntity.created(URI.create("/api/ordenes/" + creada.getId())).body(creada);
    }

    @Operation(summary = "Actualizar registro completo", description = "PUT del recurso orden.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "400", description = "Solicitud inválida"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado"), @ApiResponse(responseCode = "409", description = "Conflicto con el estado del recurso")})
    @PutMapping("/{id}")
    public Orden actualizar(@PathVariable Long id, @Valid @RequestBody OrdenRequest solicitud) {
        return servicio.actualizar(id, solicitud);
    }

    @Operation(summary = "Modificar campos del registro", description = "PATCH del recurso orden.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "400", description = "Solicitud inválida"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @PatchMapping("/{id}")
    public Orden modificar(@PathVariable Long id, @RequestBody JsonNode cambios) {
        return servicio.modificar(id, cambios);
    }

    @Operation(summary = "Eliminar registro", description = "DELETE del recurso orden.")
    @ApiResponses({@ApiResponse(responseCode = "204", description = "Recurso eliminado"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
