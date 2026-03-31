package sv.gob.salud.zacamil.alta_medica_servic.infrastructure;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import sv.gob.salud.zacamil.alta_medica_servic.domain.Cama;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CamaRepository camaRepository;

    public DataSeeder(CamaRepository camaRepository) {
        this.camaRepository = camaRepository;
    }

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DataSeeder.class);

    @Override
    public void run(String... args) throws Exception {
        log.info("🧹 LIMPIANDO TABLA DE CAMAS EN SQL ANTES DEL SEEDING...");
        camaRepository.deleteAll(); // Destruimos los datos anteriores para un arranque limpio
        
        log.info("🌱 SEMBRANDO ESCENARIOS DE PRUEBA EN SQL SERVER...");

        Cama cama101 = new Cama("101", "OCUPADA", "PAC-111");
        Cama cama102 = new Cama("102", "OCUPADA", "PAC-222");
        Cama cama103 = new Cama("103", "DISPONIBLE", null);
        Cama cama104 = new Cama("104", "CONTAMINADA", null);

        camaRepository.saveAll(java.util.Arrays.asList(cama101, cama102, cama103, cama104));

        log.info("✅ 🛏️ HOSPITAL ZACAMIL: 4 Escenarios de camas insertados en SQL exitosamente.");
    }
}