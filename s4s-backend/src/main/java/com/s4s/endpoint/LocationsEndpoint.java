package com.s4s.endpoint;

import com.s4s.database.LocationsAccess;
import com.s4s.dto.ResponseHelper;
import com.s4s.dto.response.Info;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Endpoint for all location relevant api calls.
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
@Path("/location")
public class LocationsEndpoint {
    @GET
    @Path("/countries")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCountries() {
        return new ResponseHelper(Info.SUCCESS, LocationsAccess.getCountries()).build();
    }

    @GET
    @Path("/combined")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllData() {
        return new ResponseHelper(Info.SUCCESS, LocationsAccess.getCountriesWithCities()).build();
    }

    @GET
    @Path("/cities")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCities(@QueryParam("id") String id){
        return LocationsAccess.getCountryWithCity(id);
    }
}
