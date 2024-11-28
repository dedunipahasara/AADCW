package com.example.aadCw.Exception;

public class FieldNotFoundException extends RuntimeException{
    public FieldNotFoundException() {
        super();
    }

    public FieldNotFoundException(String message) {
        super(message);
    }

    public FieldNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
