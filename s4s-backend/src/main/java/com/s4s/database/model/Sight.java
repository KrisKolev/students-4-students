package com.s4s.database.model;

import com.google.cloud.firestore.DocumentReference;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Sight {
    private String uid;

    private String name;
    private String latitude;
    private String longitude;

    private String address;

    private List<Label> labelList = new ArrayList<>();
    private List<Rating> ratingList = new ArrayList<>();

    private List<String> labelsAssigned = new ArrayList<>();

    private String creator;
    private Date createdAt;
    private Date updatedAt;
    private String createdAtString;

    private double averageRating;

    public Sight() {
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public List<Label> getLabelList() {
        return labelList;
    }

    public void setLabelList(List<Label> labelList) {
        this.labelList = labelList;
    }

    public List<Rating> getRatingList() {
        return ratingList;
    }

    public void setRatingList(List<Rating> ratingList) {
        this.ratingList = ratingList;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<String> getLabelsAssigned() {
        return labelsAssigned;
    }

    public void setLabelsAssigned(List<String> labelsAssigned) {
        this.labelsAssigned = labelsAssigned;
    }

    public String getCreatedAtString() {
        if(createdAt!=null){
            return createdAt.toString();
        }
        else {
            return "";
        }
    }
}
