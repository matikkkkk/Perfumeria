package cl.luxury.catalogo.controller;

import cl.luxury.catalogo.service.AlertaStockService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/alertas-stock")
public class AlertaStockController {
    private final AlertaStockService alertas;
    public AlertaStockController(AlertaStockService alertas) { this.alertas = alertas; }
    @PostMapping("/{productoId}")
    public ResponseEntity<Map<String, String>> solicitar(@PathVariable Long productoId,
            @RequestBody Map<String, String> datos) {
        try { return ResponseEntity.ok(alertas.solicitar(productoId, datos.get("correo"))); }
        catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("mensaje", ex.getMessage()));
        }
    }
}
