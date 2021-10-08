package com.s4s.dto;

import com.s4s.dto.response.Info;
import com.s4s.dto.response.Response;

public class ResponseHelper {

    private javax.ws.rs.core.Response.ResponseBuilder jaxResponseBuilder;

    public ResponseHelper(Info info){
        this.jaxResponseBuilder = javax.ws.rs.core.Response.status(info.code, info.defaultMessage);
        this.jaxResponseBuilder.entity(new Response(info, info.defaultMessage));
    }

    public ResponseHelper(Info info, Object data){
        this.jaxResponseBuilder = javax.ws.rs.core.Response.status(info.code, info.defaultMessage);
        this.jaxResponseBuilder.entity(new Response(info, info.defaultMessage, data));
    }

    public ResponseHelper(Info info, String message){
        this.jaxResponseBuilder = javax.ws.rs.core.Response.status(info.code, message);
        this.jaxResponseBuilder.entity(new Response(info, message));
    }

    public ResponseHelper(Info info, String message, String messageDetail){
        this.jaxResponseBuilder = javax.ws.rs.core.Response.status(info.code, message);
        this.jaxResponseBuilder.entity(new Response(info, message, messageDetail));
    }

    public ResponseHelper(Info info, String message, Object data){
        this.jaxResponseBuilder = javax.ws.rs.core.Response.status(info.code, message);
        this.jaxResponseBuilder.entity(new Response(info, message, data));
    }

    public ResponseHelper(Info info, String message, String messageDetail, Object data){
        this.jaxResponseBuilder = javax.ws.rs.core.Response.status(info.code, message);
        this.jaxResponseBuilder.entity(new Response(info, message, messageDetail, data));
    }

    public javax.ws.rs.core.Response build(){
        return this.jaxResponseBuilder.build();
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> feature/MessagingRework
