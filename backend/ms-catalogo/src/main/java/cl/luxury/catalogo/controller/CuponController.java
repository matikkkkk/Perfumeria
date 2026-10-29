package cl.luxury.catalogo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
import java.net.URI;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

@Tag(name = "Cupon", description = "Operaciones del recurso cupon en el microservicio catálogo.")
@RestController @RequestMapping("/api/cupones")
public class CuponController {
    private final CuponRepository repo;
    public CuponController(CuponRepository repo) { this.repo = repo; }
    private String codigo(String s) {
        if (s == null || s.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El código del cupón es obligatorio");
        return s.trim().toUpperCase(Locale.ROOT);
    }
    private void validarFechas(Cupon c) {
        if (c.getVigenteDesde() != null && c.getVigenteHasta() != null && c.getVigenteHasta().isBefore(c.getVigenteDesde()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha de término debe ser posterior al inicio");
    }
    @Operation(summary = "Listar registros", description = "GET del recurso cupon.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Lista obtenida (puede estar vacía)")})
    @GetMapping public List<Cupon> listar() { return repo.findAll(Sort.by("codigo")); }
    @Operation(summary = "Consultar registro por identificador", description = "GET del recurso cupon.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @GetMapping("/{codigo}") public Cupon obtener(@PathVariable String codigo) {
        return repo.findById(codigo(codigo)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cupón no encontrado"));
    }
    @Operation(summary = "Validar vigencia del cupón", description = "GET del recurso cupon.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @GetMapping("/{codigo}/validar") public Map<String,Object> validar(@PathVariable String codigo) {
        Cupon c = obtener(codigo);
        LocalDate hoy = LocalDate.now();
        boolean vigente = Boolean.TRUE.equals(c.getActivo())
            && (c.getVigenteDesde() == null || !hoy.isBefore(c.getVigenteDesde()))
            && (c.getVigenteHasta() == null || !hoy.isAfter(c.getVigenteHasta()));
        if (!vigente) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cupón inactivo o vencido");
        return Map.of("codigo", c.getCodigo(), "descuento", c.getDescuento(), "valido", true);
    }
    @Transactional
    @Operation(summary = "Crear registro", description = "POST del recurso cupon.")
    @ApiResponses({@ApiResponse(responseCode = "201", description = "Recurso creado"), @ApiResponse(responseCode = "400", description = "Solicitud inválida"), @ApiResponse(responseCode = "409", description = "Conflicto con el estado del recurso")})
    @PostMapping public ResponseEntity<Cupon> crear(@Valid @RequestBody Cupon c) {
        c.setCodigo(codigo(c.getCodigo())); validarFechas(c);
        if (repo.existsById(c.getCodigo())) throw new ResponseStatusException(HttpStatus.CONFLICT, "El cupón ya existe");
        Cupon creado = repo.save(c);
        return ResponseEntity.created(URI.create("/api/cupones/" + creado.getCodigo())).body(creado);
    }
    @Transactional
    @Operation(summary = "Actualizar registro completo", description = "PUT del recurso cupon.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "400", description = "Solicitud inválida"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado"), @ApiResponse(responseCode = "409", description = "Conflicto con el estado del recurso")})
    @PutMapping("/{codigo}") public Cupon editar(@PathVariable String codigo, @Valid @RequestBody Cupon c) {
        String id = codigo(codigo); obtener(id); c.setCodigo(id); validarFechas(c); return repo.save(c);
    }
    @Transactional
    @Operation(summary = "Eliminar registro", description = "DELETE del recurso cupon.")
    @ApiResponses({@ApiResponse(responseCode = "204", description = "Recurso eliminado"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @DeleteMapping("/{codigo}") public ResponseEntity<Void> eliminar(@PathVariable String codigo) {
        String id = codigo(codigo); obtener(id); repo.deleteById(id); return ResponseEntity.noContent().build();
    }
}
