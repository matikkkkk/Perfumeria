package cl.luxury.catalogo.controller;

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

@RestController
@RequestMapping("/api/ofertas")
public class OfertaController {

    private final OfertaService servicio;

    public OfertaController(OfertaService servicio) {
        this.servicio = servicio;
    }

    /** GET /api/ofertas?activa=true&_expand=producto  (la forma que ya usa ofertasService.listarActivas) */
    @GetMapping
    public Object listar(@RequestParam(required = false) Boolean activa,
                         @RequestParam(name = "_expand", required = false) String expand) {
        return "producto".equals(expand) ? servicio.listarConProducto(activa) : servicio.listar(activa);
    }

    @GetMapping("/{id}")
    public Oferta obtener(@PathVariable Long id) {
        return servicio.obtener(id);
    }

    @PostMapping
    public ResponseEntity<Oferta> crear(@Valid @RequestBody Oferta oferta) {
        Oferta creada = servicio.crear(oferta);
        return ResponseEntity.created(URI.create("/api/ofertas/" + creada.getId())).body(creada);
    }

    @PutMapping("/{id}")
    public Oferta actualizar(@PathVariable Long id, @Valid @RequestBody Oferta oferta) {
        return servicio.actualizar(id, oferta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
