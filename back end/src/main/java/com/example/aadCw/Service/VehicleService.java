package com.example.aadCw.Service;


import com.example.aadCw.Dto.impl.VehicleDto;

import java.util.List;

public interface VehicleService extends BaseService<VehicleDto> {
    List<VehicleDto> getVehiclesByStaffId(String staffId);
}
