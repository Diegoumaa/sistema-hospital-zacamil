package sv.gob.salud.zacamil.consultas_cama.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sv.gob.salud.zacamil.consultas_cama.model.CamaView;
import sv.gob.salud.zacamil.consultas_cama.repository.CamaViewRepository;

@RestController
@RequestMapping("/api/v1/consultas")
public class ConsultasController {

    private final CamaViewRepository camaViewRepository;

    public ConsultasController(CamaViewRepository camaViewRepository) {
        this.camaViewRepository = camaViewRepository;
    }

    @GetMapping("/camas/disponibilidad")
    public java.util.List<CamaView> obtenerDisponibilidadCamas() {
        java.util.List<CamaView> lista = new java.util.ArrayList<>();
        camaViewRepository.findAll().forEach(lista::add);
        return lista;
    }
}
