package sv.gob.salud.zacamil.consultas_cama.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import sv.gob.salud.zacamil.consultas_cama.dto.FhirBundle;
import sv.gob.salud.zacamil.consultas_cama.dto.FhirBundle.BundleEntry;
import sv.gob.salud.zacamil.consultas_cama.dto.FhirLocationResource;
import sv.gob.salud.zacamil.consultas_cama.dto.FhirLocationResource.CodeableConcept;
import sv.gob.salud.zacamil.consultas_cama.dto.FhirLocationResource.Coding;
import sv.gob.salud.zacamil.consultas_cama.model.CamaView;
import sv.gob.salud.zacamil.consultas_cama.repository.CamaViewRepository;

@RestController
@RequestMapping("/api/v1/consultas")
public class ConsultasController {

    private final CamaViewRepository camaViewRepository;

    public ConsultasController(CamaViewRepository camaViewRepository) {
        this.camaViewRepository = camaViewRepository;
    }

    @GetMapping("/camas/disponibilidad")
    public List<CamaView> obtenerDisponibilidadCamas() {
        List<CamaView> lista = new ArrayList<>();
        camaViewRepository.findAll().forEach(lista::add);
        return lista;
    }

    @GetMapping("/fhir/Location")
    public FhirBundle obtenerCamasFhir() {
        List<BundleEntry> entries = new ArrayList<>();
        
        camaViewRepository.findAll().forEach(cama -> {
            String fhirStatus;
            String estado = cama.getEstado();
            
            if ("DISPONIBLE".equalsIgnoreCase(estado) || "LIMPIA".equalsIgnoreCase(estado)) {
                fhirStatus = "active";
            } else if ("OCUPADA".equalsIgnoreCase(estado)) {
                fhirStatus = "suspended";
            } else {
                fhirStatus = "inactive"; // CONTAMINADA u otros
            }
            
            FhirLocationResource resource = FhirLocationResource.builder()
                .resourceType("Location")
                .id(cama.getNumeroCama())
                .status(fhirStatus)
                .name("Cama " + cama.getNumeroCama())
                .physicalType(CodeableConcept.builder()
                    .coding(Collections.singletonList(
                        Coding.builder()
                            .system("http://terminology.hl7.org/CodeSystem/location-physical-type")
                            .code("bd")
                            .display("Bed")
                            .build()
                    ))
                    .build())
                .build();
                
            entries.add(BundleEntry.builder()
                .resource(resource)
                .build());
        });
        
        return FhirBundle.builder()
            .resourceType("Bundle")
            .type("searchset")
            .entry(entries)
            .build();
    }
}
