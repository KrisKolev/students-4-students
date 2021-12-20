package com.s4s.database;

import com.s4s.database.model.Country;



import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.concurrent.ExecutionException;

@SpringBootTest
public class LocationAccessTests {

    @BeforeEach
    void SetUp() throws ExecutionException, InterruptedException {
        LocationsAccess.createInstance();
    }

    @Test
    public void getCountries_ReturnsCountries(){
        List<Country> countries = LocationsAccess.getCountries();
        boolean hasAustria = false;
        boolean hasBulgaria = false;
        for (Country country: countries) {
            if("Austria".equalsIgnoreCase(country.getName())){
                hasAustria = true;
            }
            if("Bulgaria".equalsIgnoreCase(country.getName())){
                hasBulgaria = true;
            }
        }

        assert(hasAustria);
        assert(hasBulgaria);
        assert(countries.size() > 200);
    }
}
