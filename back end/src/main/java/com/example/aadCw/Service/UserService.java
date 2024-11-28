package com.example.aadCw.Service;


import com.example.aadCw.Dto.impl.UserDto;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Optional;

public interface UserService extends BaseService<UserDto>{
    Optional<UserDto> findByEmail(String email);

    UserDetailsService userDetailService();
}
