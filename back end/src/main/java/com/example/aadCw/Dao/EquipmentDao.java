package com.example.aadCw.Dao;


import com.example.aadCw.Entity.EquipmentEntity;
import com.example.aadCw.Entity.FieldEntity;
import com.example.aadCw.Entity.StaffEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentDao extends JpaRepository<EquipmentEntity,String> {
    List<EquipmentEntity> findByStaff(StaffEntity staff);
    List<EquipmentEntity> findByField(FieldEntity field);

}
