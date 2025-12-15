package com.Gestify.Backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; // Opcional, pero bueno para asegurar
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration; 
import org.springframework.web.cors.CorsConfigurationSource; 
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        
        http
            // 1. Deshabilitar CSRF (Crucial para APIs REST que no usan sesiones)
            .csrf(csrf -> csrf.disable())

            // 2. Deshabilitar la autenticación basada en formulario (Adiós al "Please sign in")
            .formLogin(formLogin -> formLogin.disable())
            
            // 3. Deshabilitar la autenticación HTTP básica 
            .httpBasic(httpBasic -> httpBasic.disable())
            
            .cors(Customizer.withDefaults())
            // 4. Configurar política de sesión como STATELESS (Sin estado, como debe ser una API REST)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 5. Configuración de autorización
            .authorizeHttpRequests(auth -> {
                auth
                    .requestMatchers(HttpMethod.DELETE, "/api/**").permitAll()
                    // Permitir acceso a todas las rutas que comiencen con /api/ (nuestros controladores)
                    .requestMatchers("/api/**").permitAll() 
                    
                    // Cualquier otra petición (como / o recursos estáticos) requiere autenticación 
                    // (aunque con todo deshabilitado, esto es más bien un requisito formal)
                    .anyRequest().authenticated(); 
            });

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Configura los orígenes permitidos
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173")); 
        
        // Configura los métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Permite la credenciales (si usaras cookies o headers de auth)
        configuration.setAllowCredentials(true); 

        // Configura los headers permitidos
        configuration.setAllowedHeaders(Arrays.asList("*")); 
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}