package com.example.aadCw.Dao;

import com.example.aadCw.Entity.StaffEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffDao extends JpaRepository<StaffEntity,String> {
    Optional<StaffEntity> findByEmail(String email);
}
