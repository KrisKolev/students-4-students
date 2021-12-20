package com.s4s;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import java.util.concurrent.ExecutionException;

@SpringBootApplication
@EnableScheduling
public class SpringBootJaxrsApplication {

	public static void main(String[] args) throws ExecutionException, InterruptedException {
		SpringApplication.run(SpringBootJaxrsApplication.class, args);
		ApplicationInitializer.Initialize();
	}
}
