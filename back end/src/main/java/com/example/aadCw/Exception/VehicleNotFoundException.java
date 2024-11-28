package com.example.aadCw.Exception;

public class VehicleNotFoundException extends RuntimeException{
    public VehicleNotFoundException() {
        super();
    }

    public VehicleNotFoundException(String message) {
        super(message);
    }

    public VehicleNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
