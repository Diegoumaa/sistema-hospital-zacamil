package sv.gob.salud.zacamil.consultas_cama.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CamaEvent {
    private String numeroCama;
    private String estado;
}
