package com.example.aadCw.Dao;


import com.example.aadCw.Entity.CropEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CropDao extends JpaRepository<CropEntity,String> {
}
