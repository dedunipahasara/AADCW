package com.example.aadCw.Exception;

public class CropNotFoundException extends RuntimeException{
    public CropNotFoundException() {
        super();
    }

    public CropNotFoundException(String message) {
        super(message);
    }

    public CropNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
