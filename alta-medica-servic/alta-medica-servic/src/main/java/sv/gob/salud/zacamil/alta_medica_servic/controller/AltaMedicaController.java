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

    // Este es el DTO (Data Transfer Object) para recibir el JSON
    public static class SolicitudAltaRequest {
        public String numeroCama;
    }

    @PostMapping
    public ResponseEntity<String> solicitarAlta(@RequestBody SolicitudAltaRequest request) {
        try {
            Cama camaActualizada = altaMedicaService.procesarSolicitudAlta(request.numeroCama);
            return ResponseEntity.ok("Alta procesada exitosamente para la cama: " + camaActualizada.getNumeroCama());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}