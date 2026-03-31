package sv.gob.salud.zacamil.consultas_cama.model;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Container(containerName = "Camas")
public class CamaView {
    
    @Id
    private String id;
    
    @PartitionKey
    private String numeroCama;
    
    private String estado;
    
    private String pacienteActual;
    
    private Date ultimaActualizacion;
}
