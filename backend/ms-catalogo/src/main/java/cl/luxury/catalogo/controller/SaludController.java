package cl.luxury.catalogo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/** Para comprobar rápido que el servicio está arriba: GET http://localhost:8081/api/catalogo/salud */
@RestController
@RequestMapping("/api/catalogo")
public class SaludController {

    @GetMapping("/salud")
    public Map<String, String> salud() {
        return Map.of("servicio", "ms-catalogo", "estado", "OK");
    }
}
