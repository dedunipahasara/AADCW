package com.example.aadCw.Dto.impl;


import com.example.aadCw.Dto.EquipmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class EquipmentDto implements EquipmentStatus {
    private String equipmentId;
    private String type;
    private String name;
    private String status;
    private String fieldId;
    private String staffId;
}
