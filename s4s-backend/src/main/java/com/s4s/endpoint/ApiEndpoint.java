package com.s4s.endpoint;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

@Path("/echo")
public class ApiEndpoint {

    @GET
    @Produces("text/plain")
    public Response getEcho() {
        return Response.ok().entity("pong").build();
    }
}
