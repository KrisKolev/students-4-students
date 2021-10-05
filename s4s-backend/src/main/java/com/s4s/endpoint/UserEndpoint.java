package com.s4s.endpoint;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.UserRecord.CreateRequest;
import com.s4s.database.DatabaseAccess;
import com.s4s.database.UniversityData;
import com.s4s.database.model.University;
import com.s4s.dto.UserDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Path("/user")
public class UserEndpoint {

    @POST
    @Path("/registration")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerUser(UserDTO userDTO) {
        //TODO Check email domain

        checkEmailDomain(userDTO.getEmail());

        UserRecord.CreateRequest request = new CreateRequest()
                .setEmail(userDTO.getEmail())
                .setEmailVerified(true)
                .setPassword(userDTO.getPassword())
                .setDisplayName(userDTO.getFirstname() + " " + userDTO.getLastname())
                .setDisabled(false);

        Response.ResponseBuilder responseBuilder;

        UserRecord userRecord = null;
        try {
            DatabaseAccess.createInstance();
            userRecord = FirebaseAuth.getInstance().createUser(request);

            com.s4s.database.model.User dbUser = new com.s4s.database.model.User();
            dbUser.setFirstname(userDTO.getFirstname());
            dbUser.setLastname(userDTO.getLastname());
            dbUser.setEmail(userDTO.getEmail());
            dbUser.setUid(userRecord.getUid());
            DatabaseAccess.saveOrInsertDocument(dbUser,dbUser.getUid());
        } catch (FirebaseAuthException e) {
            e.printStackTrace();

            responseBuilder = Response.status(500);
            responseBuilder.entity(e.getMessage());

            return responseBuilder.build();
        }

        responseBuilder = Response.ok();
        responseBuilder.entity(userRecord);

        return responseBuilder.build();
    }

    private boolean checkEmailDomain(String email){

        UniversityData.extractUniversities();

        List<List<String>> domains = new ArrayList<>();

        for (University u : UniversityData.universities){
            domains.add(u.getDomains());
        }

        List<String> d = domains.stream().flatMap(List::stream).collect(Collectors.toList());

        email = email.substring(email.indexOf('@'));

        return d.contains(email);

    }
}
