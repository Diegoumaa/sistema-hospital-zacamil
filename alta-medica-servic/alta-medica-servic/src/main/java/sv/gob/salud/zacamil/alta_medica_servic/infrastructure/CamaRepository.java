package sv.gob.salud.zacamil.alta_medica_servic.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sv.gob.salud.zacamil.alta_medica_servic.domain.Cama;

import java.util.Optional;

@Repository
public interface CamaRepository extends JpaRepository<Cama, Long> {
    // Spring Boot crea la consulta SQL automáticamente solo con leer el nombre del método
    Optional<Cama> findByNumeroCama(String numeroCama);
}