package com.s4s;

import com.s4s.database.DatabaseAccess;
import com.s4s.database.LocationsAccess;
import com.s4s.database.SightsAccess;
import com.s4s.database.UniversityAccess;
import com.s4s.filter.JWTTokenFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.concurrent.ExecutionException;

@SpringBootApplication
@EnableScheduling
public class SpringBootJaxrsApplication {

	public static void main(String[] args) throws ExecutionException, InterruptedException {
		SpringApplication.run(SpringBootJaxrsApplication.class, args);
		ApplicationInitializer.Initialize();
	}
}
