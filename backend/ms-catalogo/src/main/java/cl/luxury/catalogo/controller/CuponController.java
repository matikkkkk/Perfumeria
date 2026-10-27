package cl.luxury.catalogo.controller;

import cl.luxury.catalogo.model.Cupon;
import cl.luxury.catalogo.repository.CuponRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Locale;

@RestController @RequestMapping("/api/cupones")
public class CuponController {
    private final CuponRepository repo;
    public CuponController(CuponRepository repo) { this.repo = repo; }
    private String codigo(String s) { return s.trim().toUpperCase(Locale.ROOT); }
    private void validarFechas(Cupon c) {
        if (c.getVigenteDesde() != null && c.getVigenteHasta() != null && c.getVigenteHasta().isBefore(c.getVigenteDesde()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha de término debe ser posterior al inicio");
    }
    @GetMapping public List<Cupon> listar() { return repo.findAll(); }
    @GetMapping("/{codigo}") public Cupon obtener(@PathVariable String codigo) {
        return repo.findById(codigo(codigo)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cupón no encontrado"));
    }
    @GetMapping("/{codigo}/validar") public Map<String,Object> validar(@PathVariable String codigo) {
        Cupon c = obtener(codigo);
        LocalDate hoy = LocalDate.now();
        boolean vigente = Boolean.TRUE.equals(c.getActivo())
            && (c.getVigenteDesde() == null || !hoy.isBefore(c.getVigenteDesde()))
            && (c.getVigenteHasta() == null || !hoy.isAfter(c.getVigenteHasta()));
        if (!vigente) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cupón inactivo o vencido");
        return Map.of("codigo", c.getCodigo(), "descuento", c.getDescuento(), "valido", true);
    }
    @PostMapping public ResponseEntity<Cupon> crear(@Valid @RequestBody Cupon c) {
        c.setCodigo(codigo(c.getCodigo())); validarFechas(c);
        if (repo.existsById(c.getCodigo())) throw new ResponseStatusException(HttpStatus.CONFLICT, "El cupón ya existe");
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(c));
    }
    @PutMapping("/{codigo}") public Cupon editar(@PathVariable String codigo, @Valid @RequestBody Cupon c) {
        String id = codigo(codigo); obtener(id); c.setCodigo(id); validarFechas(c); return repo.save(c);
    }
    @DeleteMapping("/{codigo}") public ResponseEntity<Void> eliminar(@PathVariable String codigo) {
        String id = codigo(codigo); obtener(id); repo.deleteById(id); return ResponseEntity.noContent().build();
    }
}
