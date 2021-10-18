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

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/user")
public class UserEndpoint {

    @POST
    @Path("/registration")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerUser(UserDTO userDTO) {
        if(!UniversityAccess.isValidEmailDomain(userDTO.getEmail())){
            return new ResponseHelper(Info.FAILURE,"Email domain cannot be verified!" ).build();
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
            DatabaseAccess.saveOrInsertDocument(dbUser,dbUser.getUid());
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
            return new ResponseHelper(Info.FAILURE, e.getMessage()).build();
        }

        return new ResponseHelper(Info.SUCCESS, userRecord).build();
    }
}
