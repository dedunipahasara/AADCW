package com.example.aadCw.Service.impl;


import com.example.aadCw.Dao.StaffDao;
import com.example.aadCw.Dao.VehicleDao;
import com.example.aadCw.Dto.impl.VehicleDto;
import com.example.aadCw.Entity.StaffEntity;
import com.example.aadCw.Entity.VehicleEntity;
import com.example.aadCw.Service.VehicleService;
import com.example.aadCw.util.AppUtil;
import com.example.aadCw.util.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {
    @Autowired
    private VehicleDao vehicleDao;

    @Autowired
    private StaffDao staffDao;

    @Autowired
    private Mapping vehicleMapper;
    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR')")
    public VehicleDto save(VehicleDto dto) {
        dto.setVehicleId(AppUtil.generateVehicleId());
        VehicleEntity vehicle = vehicleMapper.toVehicleEntity(dto);
        if (dto.getStaffId() != null) {
            StaffEntity staff = staffDao.findById(dto.getStaffId())
                    .orElseThrow(() -> new IllegalArgumentException("Staff not found with ID: " + dto.getStaffId()));
            vehicle.setStaff(staff);
        }
        return vehicleMapper.toVehicleDto(vehicleDao.save(vehicle));
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR')")
    public VehicleDto update(String id, VehicleDto dto) {
        VehicleEntity existingVehicle = vehicleDao.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found with ID: " + id));

        // Update properties
        existingVehicle.setPlateNumber(dto.getPlateNumber());
        existingVehicle.setCategory(dto.getCategory());
        existingVehicle.setFuelType(dto.getFuelType());
        existingVehicle.setStatus(dto.getStatus());
        existingVehicle.setRemarks(dto.getRemarks());

        // Update associated staff
        if (dto.getStaffId() != null) {
            StaffEntity staff = staffDao.findById(dto.getStaffId())
                    .orElseThrow(() -> new IllegalArgumentException("Staff not found with ID: " + dto.getStaffId()));
            existingVehicle.setStaff(staff);
        } else {
            existingVehicle.setStaff(null); // Clear staff if not provided
        }

        return vehicleMapper.toVehicleDto(vehicleDao.save(existingVehicle));
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR')")
    public void delete(String id) {
      vehicleDao.deleteById(id);
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR') or hasRole('SCIENTIST')")
    public VehicleDto findById(String id) {
        VehicleEntity vehicle = vehicleDao.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found with ID: " + id));
        return vehicleMapper.toVehicleDto(vehicle);
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR') or hasRole('SCIENTIST')")
    public List<VehicleDto> findAll() {
        return vehicleMapper.asVehicleDtoList(vehicleDao.findAll());
    }
    // Get Vehicles by Staff ID
    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR') or hasRole('SCIENTIST')")
    public List<VehicleDto> getVehiclesByStaffId(String staffId) {
        StaffEntity staff = staffDao.findById(staffId)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found with ID: " + staffId));
        List<VehicleEntity> vehicles = vehicleDao.findByStaff(staff);
        return vehicleMapper.asVehicleDtoList(vehicles);
    }
}
