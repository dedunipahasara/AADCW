package com.example.aadCw.Dao;

import com.example.aadCw.Entity.StaffEntity;
import com.example.aadCw.Entity.VehicleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleDao extends JpaRepository<VehicleEntity,String> {
    List<VehicleEntity> findByStaff(StaffEntity staff);
}
