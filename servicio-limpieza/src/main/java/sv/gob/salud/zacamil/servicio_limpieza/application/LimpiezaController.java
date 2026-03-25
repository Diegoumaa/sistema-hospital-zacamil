package sv.gob.salud.zacamil.servicio_limpieza.application;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import sv.gob.salud.zacamil.servicio_limpieza.domain.CamaLimpieza;

import java.util.List;

@RestController
@RequestMapping("/api/v1/limpieza")
public class LimpiezaController {

    private final LimpiezaService limpiezaService;

    public LimpiezaController(LimpiezaService limpiezaService) {
        this.limpiezaService = limpiezaService;
    }

    @GetMapping("/camas-contaminadas")
    public List<CamaLimpieza> consultarCamasContaminadas() {
        return limpiezaService.obtenerCamasContaminadas();
    }

    @PutMapping("/camas/{numeroCama}/limpiar")
    public ResponseEntity<Void> marcarCamaComoLimpia(@PathVariable String numeroCama) {
        limpiezaService.marcarCamaComoLimpia(numeroCama);
        return ResponseEntity.ok().build();
    }
}
