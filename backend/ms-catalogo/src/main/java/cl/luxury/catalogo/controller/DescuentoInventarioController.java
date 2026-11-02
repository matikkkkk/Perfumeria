package cl.luxury.catalogo.controller;

import cl.luxury.catalogo.service.DescuentoInventarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventario")
public class DescuentoInventarioController {
    private final DescuentoInventarioService servicio;
    public DescuentoInventarioController(DescuentoInventarioService servicio) { this.servicio = servicio; }

    @PostMapping("/descontar")
    public ResponseEntity<Void> descontar(@Valid @RequestBody DescuentoInventarioService.Solicitud solicitud) {
        servicio.descontar(solicitud);
        return ResponseEntity.noContent().build();
    }
}
