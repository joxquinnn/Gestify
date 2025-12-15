package com.Gestify.Backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; // Opcional, pero bueno para asegurar
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // Asegura que Spring sepa que esta es la configuración principal de seguridad
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
}