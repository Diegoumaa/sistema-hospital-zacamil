package sv.gob.salud.zacamil.consultas_cama.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import sv.gob.salud.zacamil.consultas_cama.dto.CamaEvent;
import sv.gob.salud.zacamil.consultas_cama.model.CamaView;
import sv.gob.salud.zacamil.consultas_cama.repository.CamaViewRepository;

import java.util.Date;
import java.util.UUID;
import java.util.function.Consumer;

@Service
public class CamaEventListener {

    private static final Logger log = LoggerFactory.getLogger(CamaEventListener.class);
    private final CamaViewRepository camaViewRepository;

    public CamaEventListener(CamaViewRepository camaViewRepository) {
        this.camaViewRepository = camaViewRepository;
    }

    @Bean
    public Consumer<CamaEvent> procesarAltaMedica() {
        return event -> {
            if (event.getNumeroCama() == null) {
                log.warn("Mensaje descartado en procesarAltaMedica por no tener numero de cama. Evento: {}", event);
                return;
            }
            log.info("Recibido evento procesarAltaMedica para la cama: {}", event.getNumeroCama());
            
            CamaView cama = camaViewRepository.findByNumeroCama(event.getNumeroCama())
                    .orElseGet(() -> CamaView.builder()
                            .id(UUID.randomUUID().toString())
                            .numeroCama(event.getNumeroCama())
                            .build());
            
            cama.setEstado("CONTAMINADA");
            cama.setPacienteActual("SIN PACIENTE"); // paciente dado de alta
            cama.setUltimaActualizacion(new Date());
            
            camaViewRepository.save(cama);
            log.info("Cama {} actualizada a CONTAMINADA en Cosmos DB", event.getNumeroCama());
        };
    }

    @Bean
    public Consumer<CamaEvent> procesarCamaLimpia() {
        return event -> {
            if (event.getNumeroCama() == null) {
                log.warn("Mensaje descartado en procesarCamaLimpia por no tener numero de cama. Evento: {}", event);
                return;
            }
            log.info("Recibido evento procesarCamaLimpia para la cama: {}", event.getNumeroCama());
            
            CamaView cama = camaViewRepository.findByNumeroCama(event.getNumeroCama())
                    .orElseGet(() -> CamaView.builder()
                            .id(UUID.randomUUID().toString())
                            .numeroCama(event.getNumeroCama())
                            .build());
            
            cama.setEstado("DISPONIBLE");
            cama.setUltimaActualizacion(new Date());
            
            camaViewRepository.save(cama);
            log.info("Cama {} actualizada a DISPONIBLE en Cosmos DB", event.getNumeroCama());
        };
    }
}
