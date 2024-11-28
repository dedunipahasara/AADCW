package com.example.aadCw.Service;


import com.example.aadCw.Dto.impl.FieldDto;
import com.example.aadCw.Dto.impl.StaffDto;

import java.util.List;
import java.util.Optional;

public interface StaffService extends BaseService<StaffDto> {

    Optional<StaffDto> findByEmail(String email);

    List<FieldDto> getFieldsOfStaffId(String staffId);
}
