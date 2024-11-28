package com.example.aadCw.Service;


import com.example.aadCw.Dto.impl.UserDto;
import com.example.aadCw.Secure.JWTAuthResponse;
import com.example.aadCw.Secure.SignIn;

public interface AuthService {
    JWTAuthResponse signIn(SignIn signIn);
    JWTAuthResponse signUp(UserDto userDTO);
    JWTAuthResponse refreshToken(String accessToken);
}
