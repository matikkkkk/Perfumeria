package cl.luxury.ordenes.service;

import cl.luxury.ordenes.model.Orden;
import cl.luxury.ordenes.repository.OrdenRepository;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class BoletaCorreoService {
    private static final Logger log = LoggerFactory.getLogger(BoletaCorreoService.class);
    private final OrdenRepository ordenes;
    private final BoletaPdfService pdf;
    private final JavaMailSender correo;
    private final boolean habilitado;
    private final String remitente;

    public BoletaCorreoService(OrdenRepository ordenes, BoletaPdfService pdf, JavaMailSender correo,
                               @Value("${luxury.mail.enabled:false}") boolean habilitado,
                               @Value("${luxury.mail.from:}") String remitente) {
        this.ordenes = ordenes;
        this.pdf = pdf;
        this.correo = correo;
        this.habilitado = habilitado;
        this.remitente = remitente;
    }

    // Solo después del COMMIT: un SMTP caído jamás revierte una compra confirmada.
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void enviar(OrdenPagadaEvento evento) {
        if (!habilitado) return;
        try {
            Orden orden = ordenes.findById(evento.ordenId()).orElse(null);
            if (orden == null || !"Pagado".equals(orden.getEstado())) return;
            String destinatario = orden.getCliente() == null ? null : orden.getCliente().getCorreo();
            if (destinatario == null || destinatario.isBlank()) return;
            MimeMessage mensaje = correo.createMimeMessage();
            MimeMessageHelper adjunto = new MimeMessageHelper(mensaje, true, "UTF-8");
            if (remitente != null && !remitente.isBlank()) adjunto.setFrom(remitente);
            adjunto.setTo(destinatario);
            adjunto.setSubject("Luxury Perfumería - Comprobante de compra #" + orden.getId());
            adjunto.setText("Hola " + orden.getCliente().getNombre()
                    + ",\n\nTu compra #" + orden.getId() + " fue registrada como pagada."
                    + "\nAdjuntamos el comprobante PDF de tu pedido."
                    + "\n\nGracias por comprar en Luxury Perfumería.", false);
            adjunto.addAttachment("comprobante-" + orden.getId() + ".pdf",
                    new org.springframework.core.io.ByteArrayResource(pdf.generar(orden)), "application/pdf");
            correo.send(mensaje);
            log.info("Comprobante enviado para la orden {}", orden.getId());
        } catch (Exception ex) {
            log.error("No se pudo enviar comprobante para la orden {}: {}", evento.ordenId(), ex.getMessage());
        }
    }
}
