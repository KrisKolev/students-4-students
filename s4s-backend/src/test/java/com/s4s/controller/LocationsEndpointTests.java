package com.s4s.controller;

import com.google.api.client.http.HttpStatusCodes;
import com.s4s.endpoint.LocationsEndpoint;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.ws.rs.core.Response;

@SpringBootTest
public class LocationsEndpointTests {


    private LocationsEndpoint _sut = new LocationsEndpoint();

    @Test
    public void getCountries_ReturnsCountries(){
        Response response = _sut.getCountries();
        Object countries =  response.getEntity();

        countries.getClass();

        assert(response.getStatus() == HttpStatusCodes.STATUS_CODE_OK);
        //assert(countries.size()>0);
    }

}
