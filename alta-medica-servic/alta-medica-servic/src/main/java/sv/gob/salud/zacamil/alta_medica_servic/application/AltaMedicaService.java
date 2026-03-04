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
                .orElseThrow(() -> new RuntimeException("La cama " + numeroCama + " no existe en el censo del hospital."));

        // 2. LÓGICA DE NEGOCIO: Validamos el estado actual antes de hacer cambios
        if ("ALTA_SOLICITADA".equals(cama.getEstado())) {
            throw new RuntimeException("El alta ya fue solicitada previamente para esta cama.");
        }
        if ("DISPONIBLE".equals(cama.getEstado())) {
            throw new RuntimeException("Esta cama ya está disponible, no se puede procesar un alta médica.");
        }

        // 3. Si pasó las validaciones, cambiamos el estado
        cama.setEstado("ALTA_SOLICITADA");

        // 4. Guardamos en la Write DB
        return camaRepository.save(cama);

        // NOTA: En la Épica 3, aquí mismo agregaremos el código para enviar el evento a Azure Service Bus.
    }
}