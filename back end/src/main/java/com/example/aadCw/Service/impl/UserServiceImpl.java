package com.example.aadCw.Service.impl;


import com.example.aadCw.Dao.UserDao;
import com.example.aadCw.Dto.impl.UserDto;
import com.example.aadCw.Entity.UserEntity;
import com.example.aadCw.Exception.UserNotFoundException;
import com.example.aadCw.Service.UserService;
import com.example.aadCw.util.AppUtil;
import com.example.aadCw.util.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao ;
    @Autowired
    private Mapping userMapping;

    @Override
    public UserDto save(UserDto dto) {
        dto.setId(AppUtil.generateUserId());

        return userMapping.toUserDto(userDao.save(userMapping.toUserEntity(dto)));
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR') or hasRole('SCIENTIST')")
    public UserDto update(String id, UserDto dto) {
        return userMapping.toUserDto(userDao.save(userMapping.toUserEntity(dto)));
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR') or hasRole('SCIENTIST')")
    public void delete(String id) {
         userDao.deleteById(id);
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR') or hasRole('SCIENTIST')")
    public UserDto findById(String id) {
        return null;
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR') or hasRole('SCIENTIST')")
    public List<UserDto> findAll() {
        return userMapping.asUserDtoList(userDao.findAll());
    }

    @Override

    public Optional<UserDto> findByEmail(String email) {
        Optional<UserEntity> byEmail = userDao.findByEmail(email);

        return byEmail.map(userMapping::toUserDto);
    }

    @Override
    public UserDetailsService userDetailService() {
        return userName ->
                userDao.findByEmail(userName)
                        .orElseThrow(()->new UserNotFoundException("User Not Found"));
    }
}
