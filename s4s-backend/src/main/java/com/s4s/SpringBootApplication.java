package com.s4s;

import org.springframework.boot.SpringApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import java.util.concurrent.ExecutionException;

@org.springframework.boot.autoconfigure.SpringBootApplication
@EnableScheduling
public class SpringBootApplication {

	public static void main(String[] args) throws ExecutionException, InterruptedException {
		SpringApplication.run(SpringBootApplication.class, args);
		ApplicationInitializer.initialize();
	}
}
