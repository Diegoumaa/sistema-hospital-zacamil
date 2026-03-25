package sv.gob.salud.zacamil.servicio_limpieza.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sv.gob.salud.zacamil.servicio_limpieza.domain.CamaLimpieza;

import java.util.Optional;

@Repository
public interface CamaLimpiezaRepository extends JpaRepository<CamaLimpieza, Long> {
    Optional<CamaLimpieza> findByNumeroCama(String numeroCama);
}
