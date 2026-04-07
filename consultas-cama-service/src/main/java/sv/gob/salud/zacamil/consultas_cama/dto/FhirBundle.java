package sv.gob.salud.zacamil.consultas_cama.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class FhirBundle {
    @Builder.Default
    private String resourceType = "Bundle";
    
    @Builder.Default
    private String type = "searchset";
    
    private List<BundleEntry> entry;

    @Data
    @Builder
    public static class BundleEntry {
        private FhirLocationResource resource;
    }
}
