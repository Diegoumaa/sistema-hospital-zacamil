package sv.gob.salud.zacamil.consultas_cama.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class FhirLocationResource {
    @Builder.Default
    private String resourceType = "Location";
    
    private String id;
    private String status;
    private String name;
    
    private CodeableConcept physicalType;

    @Data
    @Builder
    public static class CodeableConcept {
        private List<Coding> coding;
    }

    @Data
    @Builder
    public static class Coding {
        private String system;
        private String code;
        private String display;
    }
}
