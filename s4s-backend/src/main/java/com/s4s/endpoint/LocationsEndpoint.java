package com.s4s.endpoint;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.s4s.database.DatabaseAccess;
import com.s4s.database.LocationsAccess;
import com.s4s.database.UniversityAccess;
import com.s4s.database.model.Country;
import com.s4s.dto.ResponseHelper;
import com.s4s.dto.request.UserDTO;
import com.s4s.dto.response.Info;

import javax.persistence.criteria.CriteriaBuilder;
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

    @POST
    @Path("/getCities")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCities(Country countryId){
        return LocationsAccess.getCountryWithCity(countryId.getUid());
    }
}
