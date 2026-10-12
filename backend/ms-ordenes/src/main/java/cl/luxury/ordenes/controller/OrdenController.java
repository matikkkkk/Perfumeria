package cl.luxury.ordenes.controller;

import cl.luxury.ordenes.dto.OrdenRequest;
import cl.luxury.ordenes.model.Orden;
import cl.luxury.ordenes.service.OrdenService;
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

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    private final OrdenService servicio;

    public OrdenController(OrdenService servicio) {
        this.servicio = servicio;
    }

    /** GET /api/ordenes?usuarioId=20987654K&_sort=fecha&_order=desc  (historial de compras / listado admin) */
    @GetMapping
    public List<Orden> listar(@RequestParam Map<String, String> filtros) {
        return servicio.listar(filtros);
    }

    /** Comprobación rápida: GET http://localhost:8083/api/ordenes/salud (la ruta literal gana a /{id}). */
    @GetMapping("/salud")
    public Map<String, String> salud() {
        return Map.of("servicio", "ms-ordenes", "estado", "OK");
    }

    @GetMapping("/{id}")
    public Orden obtener(@PathVariable Long id) {
        return servicio.obtener(id);
    }

    @PostMapping
    public ResponseEntity<Orden> crear(@Valid @RequestBody OrdenRequest solicitud) {
        Orden creada = servicio.crear(solicitud);
        return ResponseEntity.created(URI.create("/api/ordenes/" + creada.getId())).body(creada);
    }

    @PutMapping("/{id}")
    public Orden actualizar(@PathVariable Long id, @Valid @RequestBody OrdenRequest solicitud) {
        return servicio.actualizar(id, solicitud);
    }

    @PatchMapping("/{id}")
    public Orden modificar(@PathVariable Long id, @RequestBody JsonNode cambios) {
        return servicio.modificar(id, cambios);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
