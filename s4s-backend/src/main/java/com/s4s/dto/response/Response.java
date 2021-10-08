package com.s4s.dto.response;

public class Response {
    private Status status;
    private Object data;

    public Response(){
    }

    public Response(Info info, String message){
        this();
        this.status = new Status(info, message);
    }

    public Response(Info info, String message, String messageDetail){
        this(info, message);
        this.status.setMessageDetail(messageDetail);
    }

    public Response(Info info, String message, Object data){
        this(info, message);
        this.data = data;
    }

    public Response(Info info, String message, String messageDetail, Object data){
        this(info, message, messageDetail);
        this.data = data;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}