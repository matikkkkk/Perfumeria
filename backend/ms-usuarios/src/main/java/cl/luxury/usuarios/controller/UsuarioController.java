package cl.luxury.usuarios.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import cl.luxury.usuarios.dto.UsuarioRequest;
import cl.luxury.usuarios.dto.CambioPasswordRequest;
import cl.luxury.usuarios.model.Usuario;
import cl.luxury.usuarios.service.UsuarioService;
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

@Tag(name = "Usuario", description = "Operaciones del recurso usuario en el microservicio usuarios.")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService servicio;

    public UsuarioController(UsuarioService servicio) {
        this.servicio = servicio;
    }

    /** GET /api/usuarios?correo=x@gmail.com  |  ?run=190110222  |  ?tipo=Cliente */
    @Operation(summary = "Listar registros", description = "GET del recurso usuario.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Lista obtenida (puede estar vacía)")})
    @GetMapping
    public List<Usuario> listar(@RequestParam Map<String, String> filtros) {
        return servicio.listar(filtros);
    }

    @Operation(summary = "Consultar registro por identificador", description = "GET del recurso usuario.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @GetMapping("/{id}")
    public Usuario obtener(@PathVariable String id) {
        return servicio.obtener(id);
    }

    @Operation(summary = "Crear registro", description = "POST del recurso usuario.")
    @ApiResponses({@ApiResponse(responseCode = "201", description = "Recurso creado"), @ApiResponse(responseCode = "400", description = "Solicitud inválida"), @ApiResponse(responseCode = "409", description = "Conflicto con el estado del recurso")})
    @PostMapping
    public ResponseEntity<Usuario> crear(@Valid @RequestBody UsuarioRequest solicitud) {
        Usuario creado = servicio.crear(solicitud);
        return ResponseEntity.created(URI.create("/api/usuarios/" + creado.getRun())).body(creado);
    }

    @Operation(summary = "Actualizar registro completo", description = "PUT del recurso usuario.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "400", description = "Solicitud inválida"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado"), @ApiResponse(responseCode = "409", description = "Conflicto con el estado del recurso")})
    @PutMapping("/{id}")
    public Usuario actualizar(@PathVariable String id, @Valid @RequestBody UsuarioRequest solicitud) {
        return servicio.actualizar(id, solicitud);
    }

    @Operation(summary = "Modificar campos del registro", description = "PATCH del recurso usuario.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "400", description = "Solicitud inválida"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @PatchMapping("/{id}")
    public Usuario modificar(@PathVariable String id, @RequestBody JsonNode cambios) {
        return servicio.modificar(id, cambios);
    }

    @Operation(summary = "Cambiar contraseña", description = "POST del recurso usuario.")
    @ApiResponses({@ApiResponse(responseCode = "204", description = "Contraseña actualizada"), @ApiResponse(responseCode = "400", description = "Solicitud inválida"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @PostMapping("/{id}/cambiar-password")
    public ResponseEntity<Void> cambiarPassword(@PathVariable String id,
            @Valid @RequestBody CambioPasswordRequest solicitud) {
        servicio.cambiarPassword(id, solicitud);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Eliminar registro", description = "DELETE del recurso usuario.")
    @ApiResponses({@ApiResponse(responseCode = "204", description = "Recurso eliminado"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
