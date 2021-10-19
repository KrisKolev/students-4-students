package com.s4s.database.model;

public class City {
    private String uid;
    private String Name;
    private String CenterLongitude;
    private String CenterLatitude;

    public String getUid() {
        return uid;
    }
    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getCenterLongitude() {
        return CenterLongitude;
    }

    public void setCenterLongitude(String centerLongitude) {
        CenterLongitude = centerLongitude;
    }

    public String getCenterLatitude() {
        return CenterLatitude;
    }

    public void setCenterLatitude(String centerLatitude) {
        CenterLatitude = centerLatitude;
    }
}
