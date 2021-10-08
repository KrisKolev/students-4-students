package com.s4s.endpoint;

import com.s4s.dto.ResponseHelper;
import com.s4s.dto.response.Info;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

@Path("/echo")
public class ApiEndpoint {

    @GET
    @Produces("application/json")
    public Response getEcho() {
        return new ResponseHelper(Info.SUCCESS).build();
    }
}
