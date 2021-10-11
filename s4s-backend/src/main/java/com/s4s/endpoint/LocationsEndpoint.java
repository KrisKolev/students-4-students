package com.s4s.endpoint;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.s4s.database.DatabaseAccess;
import com.s4s.database.LocationsAccess;
import com.s4s.database.UniversityAccess;
import com.s4s.dto.ResponseHelper;
import com.s4s.dto.request.UserDTO;
import com.s4s.dto.response.Info;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/location")
public class LocationsEndpoint {
    @POST
    @Path("/getCountries")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerUser() {

        return new ResponseHelper(Info.SUCCESS, LocationsAccess.getCountries()).build();
    }

}
