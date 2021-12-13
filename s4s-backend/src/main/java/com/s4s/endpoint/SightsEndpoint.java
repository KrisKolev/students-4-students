package com.s4s.endpoint;

import com.s4s.database.SightsAccess;
import com.s4s.database.model.Label;
import com.s4s.database.model.Rating;
import com.s4s.database.model.Sight;
import com.s4s.database.model.User;
import com.s4s.dto.ResponseHelper;
import com.s4s.dto.response.Info;
import com.s4s.filter.JWTTokenRequired;
import com.s4s.properties.PropertyAccessor;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.concurrent.ExecutionException;

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

    @POST
    @Path("/update")
    @JWTTokenRequired
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateSight(Sight sight){
        return SightsAccess.updateSights(sight);
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

    @GET
    @Path("/getsight")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSightById(@QueryParam("id") String id) {
        return SightsAccess.getSightById(id);
    }

    @GET
    @Path("/mysights")
    @JWTTokenRequired
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserSights(@QueryParam("id") String userId){ return SightsAccess.getSightsForUser(userId);}

    @GET
    @Path("/myratings")
    @JWTTokenRequired
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserRatings(@QueryParam("id") String userId) {return SightsAccess.getRatingsForUser(userId);}

    @DELETE
    @Path("/deleteSight")
    @JWTTokenRequired
    @Produces(MediaType.APPLICATION_JSON)
    public void deleteSight(@QueryParam("id") String sightId){ SightsAccess.deleteSight(sightId);}

    @POST
    @Path("/addRating")
    @JWTTokenRequired
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addRating(Rating rating, @QueryParam("id") String userId, @QueryParam("sightId") String sightId){
        rating.setCreator(userId);
        rating.setSightId(sightId);
        return SightsAccess.addRating(rating,true);
    }

    @DELETE
    @Path("/deleteRating")
    @JWTTokenRequired
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteRating(@QueryParam("id") String ratingId){
        return SightsAccess.deleteRating(ratingId);
    }

    @POST
    @Path("/reload")
    @Produces(MediaType.APPLICATION_JSON)
    public Response reloadSights(User user) throws ExecutionException, InterruptedException {
        if(!user.getUid().equals(RELOAD))
            return new ResponseHelper(Info.FAILURE,"Not allowed").build();
        SightsAccess.loadSights();
        return new ResponseHelper(Info.SUCCESS, "Backend updated").build();
    }

    private static final String RELOAD = PropertyAccessor.getReload();
}
