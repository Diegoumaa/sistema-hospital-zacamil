package sv.gob.salud.zacamil.alta_medica_servic.application.dto;

import java.time.LocalDateTime;

public class PacienteDadoDeAltaEvent {
    private String numeroCama;
    private String estado;
    private String fechaHora;

    public PacienteDadoDeAltaEvent(String numeroCama, String estado) {
        this.numeroCama = numeroCama;
        this.estado = estado;
        this.fechaHora = LocalDateTime.now().toString();
    }

    // Getters necesarios para que Spring pueda convertirlo a JSON y enviarlo a Azure
    public String getNumeroCama() { return numeroCama; }
    public String getEstado() { return estado; }
    public String getFechaHora() { return fechaHora; }
}