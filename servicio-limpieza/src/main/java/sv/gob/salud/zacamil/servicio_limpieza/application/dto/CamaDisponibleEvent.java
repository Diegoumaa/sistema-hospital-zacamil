package sv.gob.salud.zacamil.servicio_limpieza.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CamaDisponibleEvent {
    private String numeroCama;
    private String estado;
    private String fechaHora;

    public CamaDisponibleEvent(String numeroCama, String estado) {
        this.numeroCama = numeroCama;
        this.estado = estado;
        this.fechaHora = LocalDateTime.now().toString();
    }
}