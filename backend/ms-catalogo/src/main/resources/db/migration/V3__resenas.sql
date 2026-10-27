-- Reseñas auténticas; las opiniones ficticias no se importan.
CREATE TABLE resenas (
 id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 producto_id BIGINT NOT NULL,
 usuario_id VARCHAR(30) NOT NULL,
 nombre VARCHAR(150) NOT NULL,
 estrellas INT NOT NULL,
 texto VARCHAR(1000) NOT NULL,
 fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uk_resena_producto_usuario (producto_id, usuario_id),
 KEY idx_resenas_producto (producto_id),
 CONSTRAINT fk_resenas_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
 CONSTRAINT ck_resena_estrellas CHECK (estrellas BETWEEN 1 AND 5)
) ENGINE=InnoDB;
