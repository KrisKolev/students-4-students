package com.s4s.filter;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.s4s.dto.ResponseHelper;
import com.s4s.dto.response.Info;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
@JWTTokenRequired
@Priority(Priorities.AUTHENTICATION)
public class JWTTokenFilter implements ContainerRequestFilter {

    public static final String BEARER_STRING = "Bearer";

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // Get the HTTP Authorization header from the request
        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (authorizationHeader == null || authorizationHeader.isEmpty()) {
            Response response = new ResponseHelper(Info.UNAUTHORIZED,
                    Info.UNAUTHORIZED.defaultMessage,
                    "Firebase ID token is missing.").build();
            requestContext.abortWith(response);
            return;
        }

        // Extract the token from the HTTP Authorization header
        String token = authorizationHeader.contains(BEARER_STRING)
                ? authorizationHeader.replace(BEARER_STRING, "").trim()
                : authorizationHeader;
        if (token == null || token.isEmpty()) {
            Response response = new ResponseHelper(Info.UNAUTHORIZED,
                    Info.UNAUTHORIZED.defaultMessage,
                    "Firebase ID token is missing.").build();
            requestContext.abortWith(response);
            return;
        }

        FirebaseToken decodedToken = null;
        try {
            decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            String uid = decodedToken.getUid();
        } catch (FirebaseAuthException e) {
            Response response = new ResponseHelper(Info.UNAUTHORIZED,
                    Info.UNAUTHORIZED.defaultMessage,
                    "Failed to verify the signature of Firebase ID token.").build();
            requestContext.abortWith(response);
            return;
        }
    }
}