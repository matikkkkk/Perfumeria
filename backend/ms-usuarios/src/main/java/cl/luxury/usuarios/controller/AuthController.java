package cl.luxury.usuarios.controller;

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

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService servicio;

    public AuthController(UsuarioService servicio) {
        this.servicio = servicio;
    }

    /** POST /api/auth/login {correo, password} -> usuario SIN contraseña, o 401 con {campo}. */
    @PostMapping("/login")
    public Usuario login(@Valid @RequestBody LoginRequest solicitud) {
        return servicio.login(solicitud.getCorreo(), solicitud.getPassword());
    }

    /** Comprobación rápida: GET http://localhost:8082/api/auth/salud */
    @GetMapping("/salud")
    public Map<String, String> salud() {
        return Map.of("servicio", "ms-usuarios", "estado", "OK");
    }
}
