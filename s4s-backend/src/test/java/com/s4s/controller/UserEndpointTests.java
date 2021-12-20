package com.s4s.controller;

import com.s4s.dto.request.UserDTO;
import com.s4s.dto.response.Info;
import com.s4s.endpoint.UserEndpoint;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.ws.rs.core.Response;

@SpringBootTest
public class UserEndpointTests {

    private UserEndpoint _sut = new UserEndpoint();

    //ToDo needs major rework as user needs always a unique mail address and can´t be the same twice!
    public void registerUser_WithValidUser_CreatesUser(){
        UserDTO user = getValidUser();

        Response response = _sut.registerUser(user);

        assert(response.getStatus() == Info.SUCCESS.code);
    }

    @Test
    public void registerUser_WithInvalidEmail_InfoCodeFailure(){
        UserDTO user = getValidUser();
        user.setEmail("ThisIsAWrongEmail");

        Response response = _sut.registerUser(user);

        assert(response.getStatus() == Info.FAILURE.code);
    }

    private UserDTO getValidUser() {
        UserDTO user = new UserDTO();
        user.setFirstname("Firstname");
        user.setLastname("Lastname");
        user.setEmail("firstname.lastname@technikum-wien.at");
        user.setNickname("someNickname");
        user.setUid("abc1");
        user.setPassword("safePass");
        return user;
    }
}
