package sv.gob.salud.zacamil.alta_medica_servic.application;

import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.gob.salud.zacamil.alta_medica_servic.application.dto.PacienteDadoDeAltaEvent;
import sv.gob.salud.zacamil.alta_medica_servic.domain.Cama;
import sv.gob.salud.zacamil.alta_medica_servic.infrastructure.CamaRepository;

@Service
public class AltaMedicaService {

    private final CamaRepository camaRepository;
    private final StreamBridge streamBridge;

    public AltaMedicaService(CamaRepository camaRepository, StreamBridge streamBridge) {
        this.camaRepository = camaRepository;
        this.streamBridge = streamBridge;
    }

    @Transactional
    public Cama procesarSolicitudAlta(String numeroCama) {
        // 1. Buscamos la cama en la base de datos local
        Cama cama = camaRepository.findByNumeroCama(numeroCama)
                .orElseThrow(() -> new RuntimeException("La cama " + numeroCama + " no existe."));

        // 2. Lógica de negocio: Validar que no se pida alta dos veces
        if ("ALTA_SOLICITADA".equals(cama.getEstado())) {
            throw new RuntimeException("El alta ya fue solicitada previamente para esta cama.");
        }

        // 3. Guardamos el cambio de estado en SQL Server
        cama.setEstado("ALTA_SOLICITADA");
        Cama camaActualizada = camaRepository.save(cama);

        // 4. ¡ÉPICA 3! Intento de envío a Azure Service Bus con rastro profundo
        try {
            PacienteDadoDeAltaEvent evento = new PacienteDadoDeAltaEvent(
                    camaActualizada.getNumeroCama(),
                    "ALTA_SOLICITADA"
            );

            System.out.println("Intentando enviar evento a Azure para la cama: " + numeroCama);

            boolean enviado = streamBridge.send("enviarAlta-out-0", evento);

            if (enviado) {
                System.out.println("✅ EVENTO ENVIADO A AZURE EXITOSAMENTE.");
            } else {
                System.err.println("⚠️ Azure recibió la petición pero el Binder devolvió 'false'. Revisa el nombre del tópico.");
            }

        } catch (Exception e) {
            System.err.println("❌ ERROR CRÍTICO AL ENVIAR A AZURE: " + e.getMessage());
            System.err.println("--- INICIO DEL RASTRO DETALLADO (STACK TRACE) ---");
            e.printStackTrace(); // Esto llenará tu consola de texto rojo útil
            System.err.println("--- FIN DEL RASTRO DETALLADO ---");

            if (e.getCause() != null) {
                System.err.println("CAUSA RAÍZ DETECTADA: " + e.getCause().getMessage());
            }
        }

        return camaActualizada;
    }
}