package sv.gob.salud.zacamil.consultas_cama.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sv.gob.salud.zacamil.consultas_cama.dto.PacienteIngresadoEvent;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*") // Para que el frontend en localhost:5173 o similar pueda llamarlo sin problemas de CORS
public class CamaSimulacionController {

    private static final Logger log = LoggerFactory.getLogger(CamaSimulacionController.class);
    private final StreamBridge streamBridge;

    public CamaSimulacionController(StreamBridge streamBridge) {
        this.streamBridge = streamBridge;
    }

    @PostMapping("/ingreso-paciente")
    public ResponseEntity<String> simularIngresoPaciente(@RequestBody PacienteIngresadoEvent event) {
        if (event.getNumeroCama() == null || event.getNombrePaciente() == null) {
            return ResponseEntity.badRequest().body("numeroCama y nombrePaciente son requeridos");
        }

        log.info("Simulando ingreso de paciente: {} a la cama: {}", event.getNombrePaciente(), event.getNumeroCama());
        
        // Enviamos el evento directamente al topic "ingresos-topic"
        boolean sent = streamBridge.send("ingresos-topic-out-0", event);
        
        if (sent) {
            return ResponseEntity.ok("Evento de ingreso enviado a ingresos-topic exitosamente");
        } else {
            return ResponseEntity.internalServerError().body("Fallo al enviar el evento a ingresos-topic");
        }
    }
}
