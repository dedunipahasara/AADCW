package com.example.aadCw.Service;


import com.example.aadCw.Dto.impl.FieldDto;
import com.example.aadCw.Dto.impl.StaffDto;

import java.util.List;

public interface FieldService extends BaseService<FieldDto> {
    List<StaffDto> getStaffIdsByFieldId(String fieldId);

}
