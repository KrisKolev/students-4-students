package com.s4s.dto;

public class UserDTO {
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private String uid;

    public UserDTO() {
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUid(){return uid;}

    public void setUid(String uid){this.uid = uid;}
}