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
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

@Provider
@JWTTokenRequired
@Priority(Priorities.AUTHENTICATION)
public class JWTTokenFilter implements ContainerRequestFilter {

    public static final String BEARER_STRING = "Bearer";
    public static ConcurrentHashMap<String, Date> jwtCache = new ConcurrentHashMap<>();

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
        if (token.isEmpty()) {
            Response response = new ResponseHelper(Info.UNAUTHORIZED,
                    Info.UNAUTHORIZED.defaultMessage,
                    "Firebase ID token is missing.").build();
            requestContext.abortWith(response);
            return;
        }

        // Check if token is already in jwt token cache and still valid
        if (jwtCache != null && !jwtCache.isEmpty()) {
            Date exp = jwtCache.get(token);

            if (exp != null && new Date().before(exp)) {
                return;
            }
        }

        // Query FirebaseAuth API
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);

            long exp = (Long) decodedToken.getClaims().get("exp") * 1000L;
            jwtCache.put(token, new Date(exp));
        } catch (FirebaseAuthException e) {
            Response response = new ResponseHelper(Info.UNAUTHORIZED,
                    Info.UNAUTHORIZED.defaultMessage,
                    "Failed to verify the signature of Firebase ID token.").build();
            requestContext.abortWith(response);
        }
    }
}