package com.s4s.endpoint;

import com.s4s.database.LocationsAccess;
import com.s4s.database.SightsAccess;
import com.s4s.database.model.Label;
import com.s4s.database.model.Sight;
import com.s4s.dto.ResponseHelper;
import com.s4s.dto.response.Info;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.security.PublicKey;

@Path("/sights")
public class SightsEndpoint {

    @GET
    @Path("/getLabels")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLabels() {
        return new ResponseHelper(Info.SUCCESS, SightsAccess.getLabels()).build();
    }

    @POST
    @Path("/addLabel")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addLabel(Label label){
        return SightsAccess.addLabel(label);
    }

    @POST
    @Path("/addSight")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addSight(Sight sight){
        return SightsAccess.addSights(sight);
    }
}
