package com.s4s.endpoint;

import com.s4s.database.LocationsAccess;
import com.s4s.database.model.Country;
import com.s4s.dto.ResponseHelper;
import com.s4s.dto.response.Info;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/location")
public class LocationsEndpoint {
    @GET
    @Path("/getCountries")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCountries() {
        return new ResponseHelper(Info.SUCCESS, LocationsAccess.getCountries()).build();
    }

    @GET
    @Path("/allData")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllData() {
        return new ResponseHelper(Info.SUCCESS, LocationsAccess.getCountriesWithCities()).build();
    }



    @POST
    @Path("/getCities")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCities(Country countryId){
        return LocationsAccess.getCountryWithCity(countryId.getUid());
    }
}
