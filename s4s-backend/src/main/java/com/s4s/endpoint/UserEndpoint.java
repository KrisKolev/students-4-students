package com.s4s.endpoint;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.UserRecord.CreateRequest;
import com.s4s.database.DatabaseAccess;
import com.s4s.database.UniversityAccess;
import com.s4s.database.model.User;
import com.s4s.dto.ResponseHelper;
import com.s4s.dto.request.UserDTO;
import com.s4s.dto.response.Info;
import com.s4s.filter.JWTTokenFilter;
import com.s4s.filter.JWTTokenRequired;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.concurrent.ExecutionException;

@Path("/user")
public class UserEndpoint {

    @POST
    @Path("/registration")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerUser(UserDTO userDTO) {
        if (!UniversityAccess.isValidEmailDomain(userDTO.getEmail())) {
            return new ResponseHelper(Info.FAILURE, "Email domain cannot be verified!").build();
        }

        UserRecord.CreateRequest request = new CreateRequest()
                .setEmail(userDTO.getEmail())
                .setEmailVerified(true)
                .setPassword(userDTO.getPassword())
                .setDisplayName(userDTO.getFirstname() + " " + userDTO.getLastname()+ " " + userDTO.getNickname())
                .setDisabled(false);

        UserRecord userRecord;
        try {
            DatabaseAccess.createInstance();
            userRecord = FirebaseAuth.getInstance().createUser(request);

            com.s4s.database.model.User dbUser = new com.s4s.database.model.User();
            dbUser.setFirstname(userDTO.getFirstname());
            dbUser.setLastname(userDTO.getLastname());
            dbUser.setNickname(userDTO.getNickname());
            dbUser.setEmail(userDTO.getEmail());
            dbUser.setUid(userRecord.getUid());
            DatabaseAccess.saveOrInsertDocument(DatabaseAccess.documentMap.get(dbUser.getClass()), dbUser, dbUser.getUid());
        } catch (FirebaseAuthException | ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return new ResponseHelper(Info.FAILURE, e.getMessage()).build();
        }

        return new ResponseHelper(Info.SUCCESS, userRecord).build();
    }

    /**
     * Verifies the user
     *
     * @return
     */
    @GET
    @Path("/verify")
    @Consumes(MediaType.APPLICATION_JSON)
    @JWTTokenRequired
    public Response verifyUser() {
        return new ResponseHelper(Info.SUCCESS, "User verified.").build();
    }


    /**
     * Updates the user
     */
    @POST
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @JWTTokenRequired
    public Response updateUser(UserDTO userDTO) throws FirebaseAuthException, ExecutionException, InterruptedException {
        UserRecord.UpdateRequest updateRequest = new UserRecord.UpdateRequest(userDTO.getUid())
                .setDisplayName(userDTO.getFirstname() + " " + userDTO.getLastname() + " " + userDTO.getNickname());

        UserRecord userRecord;
        try {
            com.s4s.database.model.User dbUser = new com.s4s.database.model.User();
            userRecord = FirebaseAuth.getInstance().updateUser(updateRequest);
            DatabaseAccess.updateStringAttribute(DatabaseAccess.documentMap.get(dbUser.getClass()), userDTO.getUid(), "firstname", userDTO.getFirstname());
            DatabaseAccess.updateStringAttribute(DatabaseAccess.documentMap.get(dbUser.getClass()), userDTO.getUid(), "lastname", userDTO.getLastname());
            DatabaseAccess.updateStringAttribute(DatabaseAccess.documentMap.get(dbUser.getClass()), userDTO.getUid(), "nickname", userDTO.getNickname());


        } catch (FirebaseAuthException exception) {
            return new ResponseHelper(Info.FAILURE).build();
        }

        return new ResponseHelper(Info.SUCCESS).build();
    }

    @POST
    @Path("/updateavatar")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @JWTTokenRequired
    public Response updateProfilePicture(UserDTO userDTO) throws FirebaseAuthException, ExecutionException, InterruptedException {
        UserRecord.UpdateRequest updateRequest = new UserRecord.UpdateRequest(userDTO.getUid())
                .setPhotoUrl(userDTO.getPhotoUrl());

        UserRecord userRecord;
        try {
            com.s4s.database.model.User dbUser = new com.s4s.database.model.User();
            userRecord = FirebaseAuth.getInstance().updateUser(updateRequest);
            DatabaseAccess.updateStringAttribute(DatabaseAccess.documentMap.get(dbUser.getClass()), userDTO.getUid(), "photoUrl", userDTO.getPhotoUrl());

        } catch (FirebaseAuthException exception) {
            return new ResponseHelper(Info.FAILURE).build();
        }

        return new ResponseHelper(Info.SUCCESS).build();
    }

    @POST
    @Path("/updatepassword")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @JWTTokenRequired
    public Response updatePassword(UserDTO userDTO) throws FirebaseAuthException, ExecutionException, InterruptedException {
        UserRecord.UpdateRequest updateRequest = new UserRecord.UpdateRequest(userDTO.getUid())
                .setPassword(userDTO.getPassword());

        UserRecord userRecord;
        try {
            com.s4s.database.model.User dbUser = new com.s4s.database.model.User();
            userRecord = FirebaseAuth.getInstance().updateUser(updateRequest);
        } catch (FirebaseAuthException exception) {
            return new ResponseHelper(Info.FAILURE).build();
        }

        return new ResponseHelper(Info.SUCCESS).build();
    }

    /**
     * Deletes the user
     */
    @DELETE
    @Path("/delete")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @JWTTokenRequired
    public Response deleteUser(@HeaderParam("Authorization") String authorization) {
        //Extract user jwt
        String jwt = authorization.contains(JWTTokenFilter.BEARER_STRING)
                ? authorization.replace(JWTTokenFilter.BEARER_STRING, "").trim()
                : authorization;

        //Extract user id
        String uid = null;
        try {
            FirebaseToken firebaseToken = FirebaseAuth.getInstance().verifyIdToken(jwt);
            uid = firebaseToken.getUid();
        } catch (FirebaseAuthException e) {
            Response response = new ResponseHelper(Info.FAILURE,
                    Info.FAILURE.defaultMessage,
                    "Failed to verify the signature of Firebase ID token.").build();
            return response;
        }

        //Delete user
        try {
            FirebaseAuth.getInstance().deleteUser(uid);
            DatabaseAccess.deleteDocument("user", uid);
        } catch (Exception e) {
            Response response = new ResponseHelper(Info.FAILURE,
                    Info.FAILURE.defaultMessage, e.getMessage()
                    ).build();
            return response;
        }

        return new ResponseHelper(Info.SUCCESS, "User deleted.").build();
    }
}

