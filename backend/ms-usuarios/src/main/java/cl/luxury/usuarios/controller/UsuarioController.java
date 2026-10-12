package cl.luxury.usuarios.controller;

import cl.luxury.usuarios.dto.UsuarioRequest;
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

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService servicio;

    public UsuarioController(UsuarioService servicio) {
        this.servicio = servicio;
    }

    /** GET /api/usuarios?correo=x@gmail.com  |  ?run=190110222  |  ?tipo=Cliente */
    @GetMapping
    public List<Usuario> listar(@RequestParam Map<String, String> filtros) {
        return servicio.listar(filtros);
    }

    @GetMapping("/{id}")
    public Usuario obtener(@PathVariable String id) {
        return servicio.obtener(id);
    }

    @PostMapping
    public ResponseEntity<Usuario> crear(@Valid @RequestBody UsuarioRequest solicitud) {
        Usuario creado = servicio.crear(solicitud);
        return ResponseEntity.created(URI.create("/api/usuarios/" + creado.getRun())).body(creado);
    }

    @PutMapping("/{id}")
    public Usuario actualizar(@PathVariable String id, @Valid @RequestBody UsuarioRequest solicitud) {
        return servicio.actualizar(id, solicitud);
    }

    @PatchMapping("/{id}")
    public Usuario modificar(@PathVariable String id, @RequestBody JsonNode cambios) {
        return servicio.modificar(id, cambios);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
