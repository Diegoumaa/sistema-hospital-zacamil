package sv.gob.salud.zacamil.servicio_limpieza.application;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import sv.gob.salud.zacamil.servicio_limpieza.domain.CamaLimpieza;
import sv.gob.salud.zacamil.servicio_limpieza.infrastructure.CamaLimpiezaRepository;

@Slf4j
@Service
public class LimpiezaService {

    private final CamaLimpiezaRepository camaLimpiezaRepository;

    public LimpiezaService(CamaLimpiezaRepository camaLimpiezaRepository) {
        this.camaLimpiezaRepository = camaLimpiezaRepository;
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
}
