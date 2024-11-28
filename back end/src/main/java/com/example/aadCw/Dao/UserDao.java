package com.example.aadCw.Dao;

import com.example.aadCw.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDao extends JpaRepository<UserEntity,String> {


    Optional<UserEntity> findByEmail(String email);
}
