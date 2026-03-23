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
    public static class FhirEncounterRequest {
        public String resourceType;
        public String status;
        public List<LocationEntry> location;
    }

    public static class LocationEntry {
        public LocationDetails location;
    }

    public static class LocationDetails {
        public String reference; // Recibirá "Location/CAMA-102"
    }

    @PostMapping
    public ResponseEntity<String> solicitarAlta(@RequestBody FhirEncounterRequest request) {
        try {
            // 1. Validamos que venga la ubicación
            if (request.location == null || request.location.isEmpty() || request.location.get(0).location == null) {
                return ResponseEntity.badRequest().body("Error: Formato FHIR inválido. Falta la referencia de la cama.");
            }

            // 2. Extraemos y limpiamos el número de cama (Quitamos "Location/CAMA-")
            String referencia = request.location.get(0).location.reference;
            String numeroCama = referencia.replace("Location/CAMA-", "").replace("Location/Cama-", "");

            // 3. Procesamos con la lógica de negocio
            Cama camaActualizada = altaMedicaService.procesarSolicitudAlta(numeroCama);

            return ResponseEntity.ok("Alta procesada exitosamente bajo estándar FHIR Encounter para la cama: " + camaActualizada.getNumeroCama());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error de validación: " + e.getMessage());
        }
    }
}