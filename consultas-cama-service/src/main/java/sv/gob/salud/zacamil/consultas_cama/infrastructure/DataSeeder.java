package sv.gob.salud.zacamil.consultas_cama.infrastructure;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import sv.gob.salud.zacamil.consultas_cama.model.CamaView;
import sv.gob.salud.zacamil.consultas_cama.repository.CamaViewRepository;

import java.util.Arrays;
import java.util.Date;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private final CamaViewRepository camaViewRepository;

    public DataSeeder(CamaViewRepository camaViewRepository) {
        this.camaViewRepository = camaViewRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("🧹 LIMPIANDO DATOS ANTERIORES EN COSMOS DB...");
        camaViewRepository.deleteAll(); // Refrescamos la vista materializada para sincronizar el estado
        
        log.info("🌱 SINCRONIZANDO VISTAS MATERIALIZADAS CON SQL...");

        CamaView cama101 = new CamaView(UUID.randomUUID().toString(), "101", "OCUPADA", "PAC-111", new Date());
        CamaView cama102 = new CamaView(UUID.randomUUID().toString(), "102", "OCUPADA", "PAC-222", new Date());
        CamaView cama103 = new CamaView(UUID.randomUUID().toString(), "103", "DISPONIBLE", "SIN PACIENTE", new Date());
        CamaView cama104 = new CamaView(UUID.randomUUID().toString(), "104", "CONTAMINADA", "SIN PACIENTE", new Date());

        camaViewRepository.saveAll(Arrays.asList(cama101, cama102, cama103, cama104));

        log.info("✅ 🛏️ CQRS: 4 Escenarios de camas materializadas en Cosmos DB.");
    }
}
