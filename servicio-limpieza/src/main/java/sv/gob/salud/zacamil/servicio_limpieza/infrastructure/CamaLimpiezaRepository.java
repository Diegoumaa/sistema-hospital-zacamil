package sv.gob.salud.zacamil.servicio_limpieza.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sv.gob.salud.zacamil.servicio_limpieza.domain.CamaLimpieza;

import java.util.Optional;
import java.util.List;

@Repository
public interface CamaLimpiezaRepository extends JpaRepository<CamaLimpieza, Long> {
    Optional<CamaLimpieza> findByNumeroCama(String numeroCama);
    List<CamaLimpieza> findByEstado(String estado);
}
