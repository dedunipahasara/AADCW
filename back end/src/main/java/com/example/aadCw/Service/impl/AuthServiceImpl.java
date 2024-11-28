package com.example.aadCw.Service.impl;


import com.example.aadCw.Dao.UserDao;
import com.example.aadCw.Dto.impl.UserDto;
import com.example.aadCw.Entity.UserEntity;
import com.example.aadCw.Exception.UserNotFoundException;
import com.example.aadCw.Secure.JWTAuthResponse;
import com.example.aadCw.Secure.SignIn;
import com.example.aadCw.Service.AuthService;
import com.example.aadCw.Service.JwtService;
import com.example.aadCw.util.AppUtil;
import com.example.aadCw.util.Mapping;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserDao userDao;
    private final Mapping mapping;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    @Override
    public JWTAuthResponse signIn(SignIn signIn) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signIn.getEmail(),signIn.getPassword()));
        var user = userDao.findByEmail(signIn.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User Not found"));
        var generatedToken = jwtService.generateToken(user);

        return JWTAuthResponse.builder().token(generatedToken).build();
    }

    //save user in db and issue a token
    @Override
    public JWTAuthResponse signUp(UserDto userDTO) {
        userDTO.setId(AppUtil.generateUserId());
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        //save user
        UserEntity savedUser = userDao.save(mapping.toUserEntity(userDTO));
        //generate token
        var token = jwtService.generateToken(savedUser);
        return JWTAuthResponse.builder().token(token).build();
    }

    @Override
    public JWTAuthResponse refreshToken(String accessToken) {
        //extract username from existing token
        var userName= jwtService.extractUserName(accessToken);
        //check the user availability in the db
        var findUser=  userDao.findByEmail(userName)
                .orElseThrow(() -> new UserNotFoundException("User Not found"));
        var refreshedToken = jwtService.refreshToken(findUser);
        return JWTAuthResponse.builder().token(refreshedToken).build();


    }
}
