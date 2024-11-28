package com.example.aadCw.Service;


import com.example.aadCw.Dto.impl.EquipmentDto;

import java.util.List;

public interface EquipmentService extends BaseService<EquipmentDto> {
    List<EquipmentDto> getEquipmentByStaffId(String staffId);
    List<EquipmentDto> getEquipmentByFieldId(String fieldId);

}
