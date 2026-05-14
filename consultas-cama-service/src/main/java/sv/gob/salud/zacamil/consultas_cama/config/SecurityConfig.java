package sv.gob.salud.zacamil.consultas_cama.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Deshabilitar CORS y CSRF para evitar bloqueos del navegador en desarrollo
                .cors(cors -> cors.disable())
                .csrf(csrf -> csrf.disable())
                
                // 2. Hacer que no sea tan estricto: Permite todas las peticiones (permitAll)
                .authorizeHttpRequests(authz -> authz
                        .anyRequest().permitAll()
                );
                
        return http.build();
    }
}