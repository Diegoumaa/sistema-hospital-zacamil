package sv.gob.salud.zacamil.servicio_limpieza.infrastructure;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import sv.gob.salud.zacamil.servicio_limpieza.domain.CamaLimpieza;

@Component
public class DataSeederLimpieza implements CommandLineRunner {

    private final CamaLimpiezaRepository repository;

    public DataSeederLimpieza(CamaLimpiezaRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Catálogo maestro de camas del Hospital Zacamil para el dominio de Limpieza
        if (repository.count() == 0) {
            crearCama("101", "LIMPIA");
            crearCama("102", "CONTAMINADA"); // Empezamos asumiendo que la 102 viene sucia de la Épica 3
            crearCama("205", "LIMPIA");
            System.out.println("🧹 SERVICIO LIMPIEZA: Catálogo de camas sincronizado e inicializado.");
        }
    }

    private void crearCama(String numeroCama, String estado) {
        CamaLimpieza cama = new CamaLimpieza();
        cama.setNumeroCama(numeroCama);
        cama.setEstado(estado);
        repository.save(cama);
    }
}