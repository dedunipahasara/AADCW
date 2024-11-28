package com.example.aadCw.customStausCode;

public enum CustomStatusCode {
    USER_NOT_FOUND(404),
    INVALID_CREDENTIALS(401),
    SUCCESS(200);

    private final int code;

    CustomStatusCode(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
