package sv.gob.salud.zacamil.alta_medica_servic.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.gob.salud.zacamil.alta_medica_servic.application.AltaMedicaService;
import sv.gob.salud.zacamil.alta_medica_servic.domain.Cama;

import java.util.List;

@RestController
@RequestMapping("/api/v1/altas")
public class AltaMedicaController {

    private final AltaMedicaService altaMedicaService;

    public AltaMedicaController(AltaMedicaService altaMedicaService) {
        this.altaMedicaService = altaMedicaService;
    }

    // --- DTOs ACTUALIZADOS PARA EL FORMATO 'Encounter' DEL FRONTEND ---
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
    public static class FhirEncounterRequest {
        public String resourceType;
        public String status;
        public List<LocationEntry> location;
    }

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
    public static class LocationEntry {
        public LocationDetails location;
    }

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
    public static class LocationDetails {
        public String reference; // Recibirá "Location/CAMA-102"
    }

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AltaMedicaController.class);

    @PostMapping
    public ResponseEntity<String> solicitarAlta(@RequestBody FhirEncounterRequest request) {
        log.info("📥 [INBOUND] Petición POST recibida en /api/v1/altas para procesar alta médica.");
        // 1. Validamos que venga la ubicación
        if (request.location == null || request.location.isEmpty() || request.location.get(0).location == null) {
            throw new IllegalArgumentException("Error: Formato FHIR inválido. Falta la referencia de la cama.");
        }

        // 2. Extraemos y limpiamos el número de cama
        String referencia = request.location.get(0).location.reference;
        String numeroCamaExtraido = referencia.replace("Location/CAMA-", "").replace("Location/Cama-", "").replace("Location/", "");

        log.info("🔍 Transformando payload FHIR. Cama extraída: [{}]", numeroCamaExtraido);

        // 3. Procesamos con la lógica de negocio
        Cama camaActualizada = altaMedicaService.procesarSolicitudAlta(numeroCamaExtraido);
        log.info("✅ [OUTBOUND HTTP] Alta procesada correctamente para cama: {}", camaActualizada.getNumeroCama());

        return ResponseEntity.ok("Alta procesada exitosamente bajo estándar FHIR Encounter para la cama: " + camaActualizada.getNumeroCama());
    }
}