package sv.gob.salud.zacamil.alta_medica_servic.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "camas")
public class Cama {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroCama;
    private String estado;
    private String pacienteId;

    // Constructores vacíos exigidos por JPA
    public Cama() {}

    public Cama(String numeroCama, String estado, String pacienteId) {
        this.numeroCama = numeroCama;
        this.estado = estado;
        this.pacienteId = pacienteId;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroCama() { return numeroCama; }
    public void setNumeroCama(String numeroCama) { this.numeroCama = numeroCama; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getPacienteId() { return pacienteId; }
    public void setPacienteId(String pacienteId) { this.pacienteId = pacienteId; }
}