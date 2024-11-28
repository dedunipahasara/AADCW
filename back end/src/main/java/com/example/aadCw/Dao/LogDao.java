package com.example.aadCw.Dao;

import com.example.aadCw.Entity.LogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogDao extends JpaRepository<LogEntity,String> {
}
