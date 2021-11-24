package com.s4s.endpoint;

import com.s4s.database.LocationsAccess;
import com.s4s.database.SightsAccess;
import com.s4s.database.model.Label;
import com.s4s.database.model.Sight;
import com.s4s.dto.ResponseHelper;
import com.s4s.dto.response.Info;
import com.s4s.filter.JWTTokenRequired;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.security.PublicKey;

/**
 * Endpoint for all sights relevant api calls.
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
@Path("/sights")
public class SightsEndpoint {

    @GET
    @Path("/labels")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLabels() {
        return new ResponseHelper(Info.SUCCESS, SightsAccess.getLabels()).build();
    }

    @POST
    @Path("/label")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addLabel(Label label){
        return SightsAccess.addLabel(label);
    }

    @POST
    @Path("/sight")
    @JWTTokenRequired
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addSight(Sight sight,@QueryParam("user") String user){
        return SightsAccess.addSights(sight,user);
    }

    @GET
    @Path("/allsights")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllSights() {
        return new ResponseHelper(Info.SUCCESS, SightsAccess.getSights()).build();
    }

    @GET
    @Path("/topsights")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTopSights(@QueryParam("longitude") String longitude, @QueryParam("latitude") String latitude, @QueryParam("radius") String radius){
        return SightsAccess.getTopSights(Double.parseDouble(longitude),Double.parseDouble(latitude),Double.parseDouble(radius));
    }

}
