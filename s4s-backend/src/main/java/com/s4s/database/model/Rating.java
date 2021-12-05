package com.s4s.database.model;

import com.google.cloud.firestore.DocumentReference;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Rating {
    private String uid;

    private String rating;
    private String name;
    private String comment;

    private List<String> imageNames = new ArrayList<>();

    private String creator;
    private Date createdAt;
    private Date updatedAt;

    private String sightId;
    public String sightName;

    public String getSightId(){return  sightId;}

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<String> getImageNames() {
        return imageNames;
    }

    public void setImageNames(List<String> imageNames) {
        this.imageNames = imageNames;
    }

    public void setSightId(String sightId) {
        this.sightId = sightId;
    }
}
