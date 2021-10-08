package com.s4s.dto.response;

public enum Info {

    SUCCESS(200, "Request was successfull."),
    FAILURE(500, "Request failed.");

    public final int code;
    public final String defaultMessage;

    Info(int code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> feature/MessagingRework
