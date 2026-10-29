package cl.luxury.ordenes.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import cl.luxury.ordenes.dto.MensajeRequest;
import cl.luxury.ordenes.model.Mensaje;
import cl.luxury.ordenes.service.MensajeService;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;
import java.util.Map;

@Tag(name = "Mensaje", description = "Operaciones del recurso mensaje en el microservicio órdenes.")
@RestController
@RequestMapping("/api/mensajes")
public class MensajeController {

    private final MensajeService servicio;

    public MensajeController(MensajeService servicio) {
        this.servicio = servicio;
    }

    @Operation(summary = "Listar registros", description = "GET del recurso mensaje.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Lista obtenida (puede estar vacía)")})
    @GetMapping
    public List<Mensaje> listar(@RequestParam Map<String, String> filtros) {
        return servicio.listar(filtros);
    }

    @Operation(summary = "Consultar registro por identificador", description = "GET del recurso mensaje.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @GetMapping("/{id}")
    public Mensaje obtener(@PathVariable Long id) {
        return servicio.obtener(id);
    }

    @Operation(summary = "Crear registro", description = "POST del recurso mensaje.")
    @ApiResponses({@ApiResponse(responseCode = "201", description = "Recurso creado"), @ApiResponse(responseCode = "400", description = "Solicitud inválida"), @ApiResponse(responseCode = "409", description = "Conflicto con el estado del recurso")})
    @PostMapping
    public ResponseEntity<Mensaje> crear(@Valid @RequestBody MensajeRequest solicitud) {
        Mensaje creado = servicio.crear(solicitud);
        return ResponseEntity.created(URI.create("/api/mensajes/" + creado.getId())).body(creado);
    }

    @Operation(summary = "Modificar campos del registro", description = "PATCH del recurso mensaje.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "400", description = "Solicitud inválida"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @PatchMapping("/{id}")
    public Mensaje modificar(@PathVariable Long id, @RequestBody JsonNode cambios) {
        return servicio.modificar(id, cambios);
    }

    @Operation(summary = "Eliminar registro", description = "DELETE del recurso mensaje.")
    @ApiResponses({@ApiResponse(responseCode = "204", description = "Recurso eliminado"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
