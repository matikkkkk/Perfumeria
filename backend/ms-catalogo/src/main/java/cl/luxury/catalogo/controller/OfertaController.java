package cl.luxury.catalogo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import cl.luxury.catalogo.model.Oferta;
import cl.luxury.catalogo.service.OfertaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@Tag(name = "Oferta", description = "Operaciones del recurso oferta en el microservicio catálogo.")
@RestController
@RequestMapping("/api/ofertas")
public class OfertaController {

    private final OfertaService servicio;

    public OfertaController(OfertaService servicio) {
        this.servicio = servicio;
    }

    /** GET /api/ofertas?activa=true&_expand=producto  (la forma que ya usa ofertasService.listarActivas) */
    @Operation(summary = "Listar registros", description = "GET del recurso oferta.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Lista obtenida (puede estar vacía)")})
    @GetMapping
    public Object listar(@RequestParam(required = false) Boolean activa,
                         @RequestParam(name = "_expand", required = false) String expand) {
        return "producto".equals(expand) ? servicio.listarConProducto(activa) : servicio.listar(activa);
    }

    @Operation(summary = "Consultar registro por identificador", description = "GET del recurso oferta.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @GetMapping("/{id}")
    public Oferta obtener(@PathVariable Long id) {
        return servicio.obtener(id);
    }

    @Operation(summary = "Crear registro", description = "POST del recurso oferta.")
    @ApiResponses({@ApiResponse(responseCode = "201", description = "Recurso creado"), @ApiResponse(responseCode = "400", description = "Solicitud inválida"), @ApiResponse(responseCode = "409", description = "Conflicto con el estado del recurso")})
    @PostMapping
    public ResponseEntity<Oferta> crear(@Valid @RequestBody Oferta oferta) {
        Oferta creada = servicio.crear(oferta);
        return ResponseEntity.created(URI.create("/api/ofertas/" + creada.getId())).body(creada);
    }

    @Operation(summary = "Actualizar registro completo", description = "PUT del recurso oferta.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Operación realizada correctamente"), @ApiResponse(responseCode = "400", description = "Solicitud inválida"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado"), @ApiResponse(responseCode = "409", description = "Conflicto con el estado del recurso")})
    @PutMapping("/{id}")
    public Oferta actualizar(@PathVariable Long id, @Valid @RequestBody Oferta oferta) {
        return servicio.actualizar(id, oferta);
    }

    @Operation(summary = "Eliminar registro", description = "DELETE del recurso oferta.")
    @ApiResponses({@ApiResponse(responseCode = "204", description = "Recurso eliminado"), @ApiResponse(responseCode = "404", description = "Recurso no encontrado")})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
