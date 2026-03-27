package sv.gob.salud.zacamil.servicio_limpieza.application;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import sv.gob.salud.zacamil.servicio_limpieza.application.dto.CamaDisponibleEvent;
import sv.gob.salud.zacamil.servicio_limpieza.domain.CamaLimpieza;
import sv.gob.salud.zacamil.servicio_limpieza.infrastructure.CamaLimpiezaRepository;

@Slf4j
@Service
public class LimpiezaService {

    private final CamaLimpiezaRepository camaLimpiezaRepository;
    private final StreamBridge streamBridge; // Agregamos el puente hacia Azure

    public LimpiezaService(CamaLimpiezaRepository camaLimpiezaRepository, StreamBridge streamBridge) {
        this.camaLimpiezaRepository = camaLimpiezaRepository;
        this.streamBridge = streamBridge;
    }

    public List<CamaLimpieza> obtenerCamasContaminadas() {
        return camaLimpiezaRepository.findByEstado("CONTAMINADA");
    }

    @Transactional
    public void marcarCamaComoContaminada(String numeroCama) {
        try {
            CamaLimpieza cama = camaLimpiezaRepository.findByNumeroCama(numeroCama)
                    .orElseGet(() -> {
                        CamaLimpieza nuevaCama = new CamaLimpieza();
                        nuevaCama.setNumeroCama(numeroCama);
                        return nuevaCama;
                    });

            cama.setEstado("CONTAMINADA");
            camaLimpiezaRepository.save(cama);

            log.info("Cama {} guardada exitosamente en la base de datos de limpieza con estado CONTAMINADA", numeroCama);
        } catch (Exception e) {
            log.error("Error al actualizar el estado de la cama {} a CONTAMINADA", numeroCama, e);
            throw e;
        }
    }

    @Transactional
    public void marcarCamaComoLimpia(String numeroCama) {
        CamaLimpieza cama = camaLimpiezaRepository.findByNumeroCama(numeroCama)
                .orElseThrow(() -> new IllegalArgumentException("Cama " + numeroCama + " no encontrada"));

        cama.setEstado("LIMPIA");
        CamaLimpieza camaActualizada = camaLimpiezaRepository.save(cama);

        log.info("Cama {} marcada como LIMPIA exitosamente en la base de datos", numeroCama);

        // --- ÉPICA 4: Disparar el evento CamaDisponible al Service Bus ---
        try {
            CamaDisponibleEvent evento = new CamaDisponibleEvent(camaActualizada.getNumeroCama(), "DISPONIBLE");
            boolean enviado = streamBridge.send("enviarCamaLimpia-out-0", evento);

            if (enviado) {
                log.info("✅ EVENTO ENVIADO A AZURE: Cama {} vuelve a estar DISPONIBLE.", numeroCama);
            } else {
                log.warn("⚠️ Azure recibió la petición pero no se pudo enviar el evento.");
            }
        } catch (Exception e) {
            log.error("❌ ERROR CRÍTICO AL ENVIAR EVENTO DE CAMA DISPONIBLE A AZURE: {}", e.getMessage(), e);
        }
    }
}