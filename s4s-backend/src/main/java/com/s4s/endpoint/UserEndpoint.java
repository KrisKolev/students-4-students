package com.s4s.endpoint;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.UserRecord.CreateRequest;
import com.s4s.database.DatabaseAccess;
import com.s4s.database.UniversityAccess;
import com.s4s.dto.ResponseHelper;
import com.s4s.dto.request.UserDTO;
import com.s4s.dto.response.Info;
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
                .setDisplayName(userDTO.getFirstname() + " " + userDTO.getLastname())
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
     * Verifies the user endpoint
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
     * Updates the user endpoint
     */
    @POST
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @JWTTokenRequired

    public Response updateUser(UserDTO userDTO) throws FirebaseAuthException, ExecutionException, InterruptedException {
        UserRecord.UpdateRequest updateRequest = new UserRecord.UpdateRequest(userDTO.getUid())
                .setPassword(userDTO.getPassword())
                .setPhotoUrl(userDTO.getPhotoURL())
                .setDisplayName(userDTO.getFirstname() + " " + userDTO.getLastname());

        UserRecord userRecord;
        try {
            com.s4s.database.model.User dbUser = new com.s4s.database.model.User();
            userRecord = FirebaseAuth.getInstance().updateUser(updateRequest);
            DatabaseAccess.updateStringAttribute(DatabaseAccess.documentMap.get(dbUser.getClass()), userDTO.getUid(), "firstname", userDTO.getFirstname());
            DatabaseAccess.updateStringAttribute(DatabaseAccess.documentMap.get(dbUser.getClass()), userDTO.getUid(), "lastname", userDTO.getLastname());
            DatabaseAccess.updateStringAttribute(DatabaseAccess.documentMap.get(dbUser.getClass()), userDTO.getUid(), "nickname", userDTO.getNickname());
            DatabaseAccess.updateStringAttribute(DatabaseAccess.documentMap.get(dbUser.getClass()), userDTO.getUid(), "photoURL", userDTO.getPhotoURL());

        } catch (FirebaseAuthException exception) {
            return new ResponseHelper(Info.FAILURE).build();
        }

        return new ResponseHelper(Info.SUCCESS).build();
    }
}

