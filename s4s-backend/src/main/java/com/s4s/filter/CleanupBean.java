package com.s4s.filter;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import java.util.Date;

@Singleton
public class CleanupBean {

    @Schedule(minute = "*/5", hour = "*", persistent = false)
    public void cleanupJwtCache() {
        int sizeBeforeCleanup = JWTTokenFilter.jwtCache.size();

        JWTTokenFilter.jwtCache.values().removeIf(new Date()::after);

        int sizeAfterCleanup = JWTTokenFilter.jwtCache.size();

        System.out.printf("Removed %d expired items from jwt cache.%n", (sizeBeforeCleanup - sizeAfterCleanup));
    }
}