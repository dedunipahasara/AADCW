package com.example.aadCw.Service.impl;


import com.example.aadCw.Dao.CropDao;
import com.example.aadCw.Dao.FieldDao;
import com.example.aadCw.Dto.impl.CropDto;
import com.example.aadCw.Entity.CropEntity;
import com.example.aadCw.Entity.FieldEntity;
import com.example.aadCw.Service.CropService;
import com.example.aadCw.util.AppUtil;
import com.example.aadCw.util.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CropServiceImpl implements CropService {
    @Autowired
    private CropDao cropDao;
    @Autowired
    private FieldDao fieldDao;
    @Autowired
    private Mapping cropMapping;
    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('SCIENTIST')")
    public CropDto save(CropDto dto) {
        dto.setId(AppUtil.generateCropId());

        return cropMapping.toCropDto(cropDao.save(cropMapping.toCropEntity(dto)));
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('SCIENTIST')")
    public CropDto update(String id, CropDto dto) {
        CropEntity existingCrop = cropDao.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Crop not found with ID: " + id));

        // Update basic crop properties
        existingCrop.setCommonName(dto.getCommonName());
        existingCrop.setSpecificName(dto.getSpecificName());
        existingCrop.setCategory(dto.getCategory());
        existingCrop.setSeason(dto.getSeason());

        // Set the field if provided in the DTO
        if (dto.getFieldId() != null) {
            FieldEntity field = fieldDao.findById(dto.getFieldId())
                    .orElseThrow(() -> new IllegalArgumentException("Field not found with ID: " + dto.getFieldId()));
            existingCrop.setField(field);
        }

        // Handle images if provided
        if (dto.getImage1() != null) {
            existingCrop.setImage1(dto.getImage1());
        }

        // Save the updated crop entity
        return cropMapping.toCropDto(cropDao.save(existingCrop));
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('SCIENTIST')")
    public void delete(String id) {
        cropDao.deleteById(id);

    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR') or hasRole('SCIENTIST')")
    public CropDto findById(String id) {
        Optional<CropEntity> byId = cropDao.findById(id);
        if (byId.isPresent()){
            return cropMapping.toCropDto(byId.get());
        }
        return null;
    }

    @Override
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR') or hasRole('SCIENTIST')")
    public List<CropDto> findAll() {
        return cropMapping.asCropDtoList(cropDao.findAll());
    }
}
