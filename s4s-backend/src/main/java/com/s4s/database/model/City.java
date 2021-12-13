package com.s4s.database.model;

public class City {
    private String uid;
    private String name;
    private String centerLongitude;
    private String centerLatitude;

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

    public String getCenterLongitude() {
        return centerLongitude;
    }

    public void setCenterLongitude(String centerLongitude) {
        this.centerLongitude = centerLongitude;
    }

    public String getCenterLatitude() {
        return centerLatitude;
    }

    public void setCenterLatitude(String centerLatitude) {
        this.centerLatitude = centerLatitude;
    }
}
