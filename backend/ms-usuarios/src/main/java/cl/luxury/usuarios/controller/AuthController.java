package cl.luxury.usuarios.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import cl.luxury.usuarios.dto.LoginRequest;
import cl.luxury.usuarios.model.Usuario;
import cl.luxury.usuarios.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Tag(name = "Auth", description = "Operaciones del recurso auth en el microservicio usuarios.")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService servicio;

    public AuthController(UsuarioService servicio) {
        this.servicio = servicio;
    }

    /** POST /api/auth/login {correo, password} -> usuario SIN contraseña, o 401 con {campo}. */
    @Operation(summary = "Iniciar sesión", description = "POST del recurso auth.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "400", description = "Solicitud inválida"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @PostMapping("/login")
    public Usuario login(@Valid @RequestBody LoginRequest solicitud) {
        return servicio.login(solicitud.getCorreo(), solicitud.getPassword());
    }

    /** Comprobación rápida: GET http://localhost:8082/api/auth/salud */
    @Operation(summary = "Comprobar estado del servicio", description = "GET del recurso auth.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente")})
    @GetMapping("/salud")
    public Map<String, String> salud() {
        return Map.of("servicio", "ms-usuarios", "estado", "OK");
    }
}
