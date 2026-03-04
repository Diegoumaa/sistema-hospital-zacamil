package sv.gob.salud.zacamil.alta_medica_servic.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.gob.salud.zacamil.alta_medica_servic.application.AltaMedicaService;
import sv.gob.salud.zacamil.alta_medica_servic.domain.Cama;

@RestController
@RequestMapping("/api/v1/altas")
public class AltaMedicaController {

    private final AltaMedicaService altaMedicaService;

    public AltaMedicaController(AltaMedicaService altaMedicaService) {
        this.altaMedicaService = altaMedicaService;
    }

    // --- NUEVOS DTOs PARA MAPEAR HL7 FHIR ---
    public static class FhirTaskRequest {
        public String resourceType;
        public String status;
        public String intent;
        public Code code;
        public Location location;
    }

    public static class Code {
        public String text;
    }

    public static class Location {
        public String reference; // Aquí vendrá algo como "Location/Cama-102"
    }

    @PostMapping
    public ResponseEntity<String> solicitarAlta(@RequestBody FhirTaskRequest request) {
        try {
            // 1. Validamos que el JSON FHIR traiga la ubicación de la cama
            if (request.location == null || request.location.reference == null) {
                return ResponseEntity.badRequest().body("Error: Formato FHIR inválido. Falta la referencia de la cama.");
            }

            // 2. Limpiamos la cadena "Location/Cama-102" para extraer solo el "102"
            String referencia = request.location.reference;
            String numeroCama = referencia.replace("Location/Cama-", "");

            // 3. Mandamos el número limpio al servicio
            Cama camaActualizada = altaMedicaService.procesarSolicitudAlta(numeroCama);
            
            return ResponseEntity.ok("Alta procesada exitosamente bajo estándar FHIR para la cama: " + camaActualizada.getNumeroCama());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error de validación: " + e.getMessage());
        }
    }
}