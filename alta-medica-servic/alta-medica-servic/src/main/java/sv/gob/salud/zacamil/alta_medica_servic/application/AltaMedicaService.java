package sv.gob.salud.zacamil.alta_medica_servic.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.gob.salud.zacamil.alta_medica_servic.domain.Cama;
import sv.gob.salud.zacamil.alta_medica_servic.infrastructure.CamaRepository;

@Service
public class AltaMedicaService {

    private final CamaRepository camaRepository;

    public AltaMedicaService(CamaRepository camaRepository) {
        this.camaRepository = camaRepository;
    }

    @Transactional
    public Cama procesarSolicitudAlta(String numeroCama) {
        // 1. Buscamos la cama en la base de datos
        Cama cama = camaRepository.findByNumeroCama(numeroCama)
                .orElseThrow(() -> new RuntimeException("Cama no encontrada: " + numeroCama));

        // 2. Cambiamos el estado (El inicio de tu SAGA)
        cama.setEstado("ALTA_SOLICITADA");

        // 3. Guardamos en la Write DB
        return camaRepository.save(cama);

        // NOTA: En la Épica 3, aquí mismo agregaremos el código para enviar el evento a Azure Service Bus.
    }
}