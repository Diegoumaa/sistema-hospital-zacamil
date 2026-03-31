package sv.gob.salud.zacamil.consultas_cama.repository;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import org.springframework.stereotype.Repository;
import sv.gob.salud.zacamil.consultas_cama.model.CamaView;

@Repository
public interface CamaViewRepository extends CosmosRepository<CamaView, String> {
    java.util.Optional<CamaView> findByNumeroCama(String numeroCama);
}
