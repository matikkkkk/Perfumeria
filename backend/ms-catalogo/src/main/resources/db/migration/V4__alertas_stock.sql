CREATE TABLE alertas_stock (
 id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 producto_id BIGINT NOT NULL,
 correo VARCHAR(254) NOT NULL,
 creada_en TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
 enviada BOOLEAN NOT NULL DEFAULT FALSE,
 INDEX idx_alertas_pendientes (producto_id, enviada),
 CONSTRAINT fk_alerta_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB;
