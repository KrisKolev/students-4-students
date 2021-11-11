package test.java.controller;

import com.google.api.client.http.HttpStatusCodes;
import com.google.api.gax.rpc.StatusCode;
import com.s4s.database.model.Country;
import com.s4s.endpoint.LocationsEndpoint;
import com.s4s.endpoint.SightsEndpoint;
import org.junit.jupiter.api.Test;

import javax.ws.rs.core.Response;
import java.util.ArrayList;

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
