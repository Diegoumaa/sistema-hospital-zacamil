package sv.gob.salud.zacamil.servicio_limpieza.application.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacienteDadoDeAltaEvent {
    private String numeroCama;
    private String estado;
}
