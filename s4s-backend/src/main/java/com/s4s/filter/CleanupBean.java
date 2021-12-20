package com.s4s.filter;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class CleanupBean {
    @Scheduled(fixedRate = 30000)
    public void cleanupJwtCache() {
        int sizeBeforeCleanup = JWTTokenFilter.jwtCache.size();

        JWTTokenFilter.jwtCache.values().removeIf(value -> {
            return new Date().after(value);
        });

        int sizeAfterCleanup = JWTTokenFilter.jwtCache.size();
        System.out.println(
                "Fixed rate task async - " + System.currentTimeMillis() / 1000);
        System.out.printf("Removed %d expired items from jwt cache.\n", (sizeBeforeCleanup - sizeAfterCleanup));
    }
}