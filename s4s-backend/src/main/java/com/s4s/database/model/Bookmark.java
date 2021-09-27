package com.s4s.database.model;

import com.google.cloud.firestore.DocumentReference;

import java.util.Date;

public class Bookmark {
    private String uid;

    private String name;
    private DocumentReference sightReference;
    private DocumentReference creator;

    private Date createdAt;
    private Date updatedAt;

    public Bookmark() {
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

    public DocumentReference getSightReference() {
        return sightReference;
    }

    public void setSightReference(DocumentReference sightReference) {
        this.sightReference = sightReference;
    }

    public DocumentReference getCreator() {
        return creator;
    }

    public void setCreator(DocumentReference creator) {
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
}
