package sv.gob.salud.zacamil.servicio_limpieza.application;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import sv.gob.salud.zacamil.servicio_limpieza.application.dto.PacienteDadoDeAltaEvent;

import java.util.function.Consumer;

@Slf4j
@Configuration
public class LimpiezaEventListener {

    private final LimpiezaService limpiezaService;

    public LimpiezaEventListener(LimpiezaService limpiezaService) {
        this.limpiezaService = limpiezaService;
    }

    @Bean
    public Consumer<PacienteDadoDeAltaEvent> recibirAlta() {
        return evento -> {
            try {
                if (evento != null && evento.getNumeroCama() != null) {
                    log.info("Evento recibido de Azure Service Bus. Marcando cama {} como CONTAMINADA", evento.getNumeroCama());
                    limpiezaService.marcarCamaComoContaminada(evento.getNumeroCama());
                } else {
                    log.warn("Evento recibido nulo o sin n\u00famero de cama v\u00e1lido: {}", evento);
                }
            } catch (Exception e) {
                // Se captura la excepci\u00f3n en el Consumer para que no se bloquee el hilo de Service Bus
                log.error("Ocurri\u00f3 un error al procesar el evento de alta m\u00e9dica para la cama: {}. Error: {}", 
                          (evento != null ? evento.getNumeroCama() : "N/A"), e.getMessage(), e);
            }
        };
    }
}
