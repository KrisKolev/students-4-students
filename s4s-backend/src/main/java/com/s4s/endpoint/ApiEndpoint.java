package com.s4s.endpoint;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

@Path("/echo")
public class ApiEndpoint {

    @GET
    @Produces("application/json")
    public Response getEcho() {
        //ToDo: Refactor Response & Access-Control-Allow-Origin should be adapted to developing and production scenarios
        Response.ResponseBuilder responseBuilder = Response.ok();
        responseBuilder.entity("{\"message\": \"echo\"}");

        return responseBuilder.build();
    }
}
