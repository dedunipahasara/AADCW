package com.example.aadCw.util;

import com.example.aadCw.Dto.impl.*;
import com.example.aadCw.Entity.*;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class Mapping {


    @Autowired
    private ModelMapper modelMapper;

    // User Mapping
    public UserEntity toUserEntity(UserDto userDto) {
        return modelMapper.map(userDto, UserEntity.class);
    }

    public UserDto toUserDto(UserEntity userEntity) {
        return modelMapper.map(userEntity, UserDto.class);
    }

    public List<UserDto> asUserDtoList(List<UserEntity> userEntities) {
        return modelMapper.map(userEntities, new TypeToken<List<UserDto>>() {}.getType());
    }

    // Staff Mapping
    public StaffEntity toStaffEntity(StaffDto staffDto) {
        return modelMapper.map(staffDto, StaffEntity.class);
    }

    public StaffDto toStaffDto(StaffEntity staffEntity) {
        return modelMapper.map(staffEntity, StaffDto.class);
    }

    public List<StaffDto> asStaffDtoList(List<StaffEntity> staffEntities) {
        return modelMapper.map(staffEntities, new TypeToken<List<StaffDto>>() {}.getType());
    }

    // Field Mapping
    public FieldEntity toFieldEntity(FieldDto fieldDto) {
        return modelMapper.map(fieldDto, FieldEntity.class);
    }

    public FieldDto toFieldDto(FieldEntity fieldEntity) {
        return modelMapper.map(fieldEntity, FieldDto.class);
    }

    public List<FieldDto> asFieldDtoList(List<FieldEntity> fieldEntities) {
        return modelMapper.map(fieldEntities, new TypeToken<List<FieldDto>>() {}.getType());
    }

    // Crop Mapping
    public CropEntity toCropEntity(CropDto cropDto) {
        return modelMapper.map(cropDto, CropEntity.class);
    }

    public CropDto toCropDto(CropEntity cropEntity) {
        return modelMapper.map(cropEntity, CropDto.class);
    }

    public List<CropDto> asCropDtoList(List<CropEntity> cropEntities) {
        return modelMapper.map(cropEntities, new TypeToken<List<CropDto>>() {}.getType());
    }

    // Log Mapping
    public LogEntity toLogEntity(LogDto logDto) {
        return modelMapper.map(logDto, LogEntity.class);
    }

    public LogDto toLogDto(LogEntity logEntity) {
        return modelMapper.map(logEntity, LogDto.class);
    }

    public List<LogDto> asLogDtoList(List<LogEntity> logEntities) {
        return modelMapper.map(logEntities, new TypeToken<List<LogDto>>() {}.getType());
    }

    // Equipment Mapping
    public EquipmentEntity toEquipmentEntity(EquipmentDto equipmentDto) {
        return modelMapper.map(equipmentDto, EquipmentEntity.class);
    }

    public EquipmentDto toEquipmentDto(EquipmentEntity equipmentEntity) {
        return modelMapper.map(equipmentEntity, EquipmentDto.class);
    }

    public List<EquipmentDto> asEquipmentDtoList(List<EquipmentEntity> equipmentEntities) {
        return modelMapper.map(equipmentEntities, new TypeToken<List<EquipmentDto>>() {}.getType());
    }

    // Vehicle Mapping
    public VehicleEntity toVehicleEntity(VehicleDto vehicleDto) {
        return modelMapper.map(vehicleDto, VehicleEntity.class);
    }

    public VehicleDto toVehicleDto(VehicleEntity vehicleEntity) {
        return modelMapper.map(vehicleEntity, VehicleDto.class);
    }

    public List<VehicleDto> asVehicleDtoList(List<VehicleEntity> vehicleEntities) {
        return modelMapper.map(vehicleEntities, new TypeToken<List<VehicleDto>>() {}.getType());
    }
}


