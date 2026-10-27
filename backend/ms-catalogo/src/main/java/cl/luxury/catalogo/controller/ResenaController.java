package cl.luxury.catalogo.controller;

import cl.luxury.catalogo.exception.*;
import cl.luxury.catalogo.model.Resena;
import cl.luxury.catalogo.repository.ResenaRepository;
import cl.luxury.catalogo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import com.fasterxml.jackson.databind.JsonNode;
import java.net.URI;
import java.util.*;

@RestController @RequestMapping("/api/resenas")
public class ResenaController {
  private final ResenaRepository resenas;
  private final ProductoRepository productos;
  private final RestClient ordenes;
  public ResenaController(ResenaRepository resenas, ProductoRepository productos,
                          @Value("${luxury.ordenes.url:http://localhost:8083}") String ordenesUrl) {
    this.resenas = resenas;
    this.productos = productos;
    this.ordenes = RestClient.builder().baseUrl(ordenesUrl).build();
  }
  public record NuevaResena(Long productoId, String usuarioId, String nombre, Integer estrellas, String texto) {}

  @GetMapping
  public List<Resena> listar(@RequestParam Long productoId) {
    return resenas.findByProductoIdOrderByFechaDesc(productoId);
  }

  @PostMapping
  public ResponseEntity<Resena> crear(@RequestBody NuevaResena dato) {
    if (dato == null || dato.productoId() == null || dato.usuarioId() == null || dato.usuarioId().isBlank()
        || dato.nombre() == null || dato.nombre().isBlank() || dato.estrellas() == null
        || dato.estrellas() < 1 || dato.estrellas() > 5 || dato.texto() == null
        || dato.texto().isBlank() || dato.texto().trim().length() > 1000) {
      throw new SolicitudInvalidaException("Completa nombre, comentario (máximo 1000 caracteres) y calificación de 1 a 5.");
    }
    if (!productos.existsById(dato.productoId())) throw new NoEncontradoException("Producto no encontrado.");
    if (resenas.existsByProductoIdAndUsuarioId(dato.productoId(), dato.usuarioId()))
      throw new ConflictoException("Ya has publicado una reseña para este perfume.");
    if (!haComprado(dato.usuarioId(), dato.productoId()))
      throw new ConflictoException("Debes haber comprado este perfume para dejar una reseña.");
    Resena nueva = new Resena();
    nueva.setProductoId(dato.productoId()); nueva.setUsuarioId(dato.usuarioId());
    nueva.setNombre(dato.nombre().trim()); nueva.setEstrellas(dato.estrellas());
    nueva.setTexto(dato.texto().trim());
    try {
      Resena guardada = resenas.save(nueva);
      return ResponseEntity.created(URI.create("/api/resenas/" + guardada.getId())).body(guardada);
    } catch (org.springframework.dao.DataIntegrityViolationException e) {
      throw new ConflictoException("Ya has publicado una reseña para este perfume.");
    }
  }

  private boolean haComprado(String usuarioId, Long productoId) {
    try {
      JsonNode respuesta = ordenes.get().uri(uri -> uri.path("/api/ordenes")
          .queryParam("usuarioId", usuarioId).build()).retrieve().body(JsonNode.class);
      if (respuesta == null || !respuesta.isArray()) return false;
      for (JsonNode orden : respuesta) {
        if (!Set.of("Pagado", "En preparación", "Enviado", "Entregado")
            .contains(orden.path("estado").asText())) continue;
        for (JsonNode item : orden.path("items")) {
          if (String.valueOf(productoId).equals(item.path("productoId").asText())) return true;
        }
      }
      return false;
    } catch (RestClientException e) {
      throw new org.springframework.web.server.ResponseStatusException(
          org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE, "No se pudieron verificar las compras.", e);
    }
  }

  // Demo académica: igual que el CRUD de productos, sin sesión JWT en la API.
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> eliminar(@PathVariable Long id) {
    if (!resenas.existsById(id)) throw new NoEncontradoException("Reseña no encontrada.");
    resenas.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}
