package com.s4s.dto.response;

import java.util.Date;

public class Status {
    private Info info;
    private String message;
    private String messageDetail;
    private String version;
    private Date timestamp;

    public Status(Info info, String message) {
        this.info = info;
        this.message = message;
        this.timestamp = new Date();
        this.version = "0.0";
    }

    public Status(Info info, String message, String messageDetail) {
        this(info, message);
        this.messageDetail = messageDetail;
    }

    public Info getInfo() {
        return info;
    }

    public void setInfo(Info info) {
        this.info = info;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessageDetail() {
        return messageDetail;
    }

    public void setMessageDetail(String messageDetail) {
        this.messageDetail = messageDetail;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}

