package sv.gob.salud.zacamil.alta_medica_servic;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import sv.gob.salud.zacamil.alta_medica_servic.domain.Cama;
import sv.gob.salud.zacamil.alta_medica_servic.infrastructure.CamaRepository;

@SpringBootApplication
public class AltaMedicaServicApplication {

	public static void main(String[] args) {
		SpringApplication.run(AltaMedicaServicApplication.class, args);
	}

	// Este código se ejecuta automáticamente al iniciar la aplicación
	@Bean
	CommandLineRunner initDatabase(CamaRepository repository) {
		return args -> {
			// Verificamos si la cama 102 ya existe para no duplicarla
			if (repository.findByNumeroCama("102").isEmpty()) {
				System.out.println("Creando cama de prueba...");
				repository.save(new Cama("102", "OCUPADA", "PACIENTE-789"));
				System.out.println("Cama 102 creada con estado OCUPADA.");
			}
		};
	}
}