package sv.gob.salud.zacamil.consultas_cama.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacienteIngresadoEvent {
    private String numeroCama;
    private String nombrePaciente;
}
