package com.example.aadCw.Controller;

import com.example.aadCw.Dto.impl.StaffDto;
import com.example.aadCw.Dto.impl.VehicleDto;
import com.example.aadCw.Exception.StaffNotFoundException;
import com.example.aadCw.Exception.VehicleNotFoundException;
import com.example.aadCw.Service.VehicleService;
import com.example.aadCw.util.RegexUtilForId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/vehicles")
@CrossOrigin
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    // Save Vehicle
    @PostMapping
    public ResponseEntity<VehicleDto> saveVehicle(@RequestBody VehicleDto vehicleDto) {
        VehicleDto savedVehicle = vehicleService.save(vehicleDto);
        return new ResponseEntity<>(savedVehicle, HttpStatus.CREATED);
    }
    // Update Vehicle
    @PutMapping("/{vehicleId}")
    public ResponseEntity<VehicleDto> updateVehicle(@PathVariable String vehicleId, @RequestBody VehicleDto vehicleDto) {
        VehicleDto updatedVehicle = vehicleService.update(vehicleId, vehicleDto);
        return new ResponseEntity<>(updatedVehicle, HttpStatus.OK);
    }
    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<String> deleteStaff(@PathVariable("vehicleId") String vehicleId) {
        try{
            if (!RegexUtilForId.isValidVehicleId(vehicleId)){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                vehicleService.delete(vehicleId);
                return new ResponseEntity<>("Vehicle deleted successfully.", HttpStatus.NO_CONTENT);
            }
        }catch (VehicleNotFoundException e){
            return new ResponseEntity<>("vehicle not found.", HttpStatus.NOT_FOUND);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }
    @GetMapping("/{vehicleId}")
    public ResponseEntity<VehicleDto> getVehicleById(@PathVariable String vehicleId) {
        VehicleDto vehicle = vehicleService.findById(vehicleId);
        return new ResponseEntity<>(vehicle, HttpStatus.OK);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<VehicleDto> getAllUsers(){
        return vehicleService.findAll();
    }

    // Get Vehicles by Staff ID
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<VehicleDto>> getVehiclesByStaffId(@PathVariable String staffId) {
        List<VehicleDto> vehicles = vehicleService.getVehiclesByStaffId(staffId);
        return new ResponseEntity<>(vehicles, HttpStatus.OK);
    }

}
