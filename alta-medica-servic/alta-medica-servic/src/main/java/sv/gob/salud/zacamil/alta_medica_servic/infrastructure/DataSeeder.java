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

    @Override
    public void run(String... args) throws Exception {
        // Si la tabla de camas está vacía, creamos las 3 camas del frontend
        if (camaRepository.count() == 0) {
            Cama cama101 = new Cama();
            cama101.setNumeroCama("101");
            cama101.setEstado("OCUPADA");
            camaRepository.save(cama101);

            Cama cama102 = new Cama();
            cama102.setNumeroCama("102");
            cama102.setEstado("OCUPADA");
            camaRepository.save(cama102);

            Cama cama205 = new Cama();
            cama205.setNumeroCama("205");
            cama205.setEstado("OCUPADA");
            camaRepository.save(cama205);

            System.out.println("🛏️ HOSPITAL ZACAMIL: Camas iniciales insertadas en la base de datos.");
        }
    }
}