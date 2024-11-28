package com.example.aadCw.Service.impl;


import com.example.aadCw.Dao.CropDao;
import com.example.aadCw.Dao.FieldDao;
import com.example.aadCw.Dao.LogDao;
import com.example.aadCw.Dao.StaffDao;
import com.example.aadCw.Dto.impl.LogDto;
import com.example.aadCw.Entity.CropEntity;
import com.example.aadCw.Entity.FieldEntity;
import com.example.aadCw.Entity.LogEntity;
import com.example.aadCw.Entity.StaffEntity;
import com.example.aadCw.Service.LogService;
import com.example.aadCw.util.AppUtil;
import com.example.aadCw.util.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class LogServiceImpl implements LogService {
    @Autowired
    private LogDao logDao;
    @Autowired
    private FieldDao fieldDao;
    @Autowired
    private CropDao cropDao;
    @Autowired
    private StaffDao staffDao;
    @Autowired
    private Mapping logMapping;
    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('SCIENTIST')")
    public LogDto save(LogDto dto) {
        dto.setLogId(AppUtil.generateLogId());
        LogEntity logEntity = logMapping.toLogEntity(dto);
        // Retrieve and set associated staff entities
        if (dto.getStaffIds() != null && !dto.getStaffIds().isEmpty()) {
            Set<StaffEntity> staffEntities = new HashSet<>(staffDao.findAllById(dto.getStaffIds()));
            if (staffEntities.size() != dto.getStaffIds().size()) {
                throw new IllegalArgumentException("One or more staff IDs are invalid.");
            }
            logEntity.setStaffLogs(staffEntities);
        }
        // Retrieve and set associated field entities
        if (dto.getFieldIds() != null && !dto.getFieldIds().isEmpty()) {
            Set<FieldEntity> fieldEntities = new HashSet<>(fieldDao.findAllById(dto.getFieldIds()));
            if (fieldEntities.size() != dto.getFieldIds().size()) {
                throw new IllegalArgumentException("One or more field IDs are invalid.");
            }
            logEntity.setFieldLogs(fieldEntities);
        }
        // Retrieve and set associated crop entities
        if (dto.getCropIds() != null && !dto.getCropIds().isEmpty()) {
            Set<CropEntity> cropEntities = new HashSet<>(cropDao.findAllById(dto.getCropIds()));
            if (cropEntities.size() != dto.getCropIds().size()) {
                throw new IllegalArgumentException("One or more crop IDs are invalid.");
            }
            logEntity.setCropLogs(cropEntities);
        }
        // Save the log entity and map back to DTO
        LogEntity savedLog = logDao.save(logEntity);
        return logMapping.toLogDto(savedLog);
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('SCIENTIST')")
    public LogDto update(String id, LogDto dto) {
        LogEntity existingLog = logDao.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Log not found with ID: " + id));

        // Update basic fields
        existingLog.setLogDetails(dto.getLogDetails());
        existingLog.setDate((Date) dto.getDate());

        // Handle image update if provided
        if (dto.getImage2() != null) {
            existingLog.setImage2(dto.getImage2());
        }

        // Update associated staff
        if (dto.getStaffIds() != null && !dto.getStaffIds().isEmpty()) {
            List<StaffEntity> staffEntities = staffDao.findAllById(dto.getStaffIds());
            if (staffEntities.size() != dto.getStaffIds().size()) {
                throw new IllegalArgumentException("One or more staff IDs are invalid.");
            }
            existingLog.setStaffLogs(new HashSet<>(staffEntities));
        }

        // Update associated fields
        if (dto.getFieldIds() != null && !dto.getFieldIds().isEmpty()) {
            List<FieldEntity> fieldEntities = fieldDao.findAllById(dto.getFieldIds());
            if (fieldEntities.size() != dto.getFieldIds().size()) {
                throw new IllegalArgumentException("One or more field IDs are invalid.");
            }
            existingLog.setFieldLogs(new HashSet<>(fieldEntities));
        }

        // Update associated crops
        if (dto.getCropIds() != null && !dto.getCropIds().isEmpty()) {
            List<CropEntity> cropEntities = cropDao.findAllById(dto.getCropIds());
            if (cropEntities.size() != dto.getCropIds().size()) {
                throw new IllegalArgumentException("One or more crop IDs are invalid.");
            }
            existingLog.setCropLogs(new HashSet<>(cropEntities));
        }

        // Save the updated log entity and return the updated DTO
        return logMapping.toLogDto(logDao.save(existingLog));
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('SCIENTIST')")
    public void delete(String id) {
        logDao.deleteById(id);
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR') or hasRole('SCIENTIST')")
    public LogDto findById(String id) {
        Optional<LogEntity> byId = logDao.findById(id);
        if (byId.isPresent()){
            return logMapping.toLogDto(byId.get());
        }
        return null;
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR') or hasRole('SCIENTIST')")
    public List<LogDto> findAll() {
        return  logMapping.asLogDtoList(logDao.findAll());
    }
}
