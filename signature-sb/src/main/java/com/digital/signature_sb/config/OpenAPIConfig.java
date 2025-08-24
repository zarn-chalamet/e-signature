package com.digital.signature_sb.config;

import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI openAPIService() {
        return new OpenAPI()
                .info(new io.swagger.v3.oas.models.info.Info()
                        .title("E Signature Service API")
                        .description("API for managing users, digital signatures, and signature requests securely.")
                        .version("v1.0.0")
                );
    }
}
