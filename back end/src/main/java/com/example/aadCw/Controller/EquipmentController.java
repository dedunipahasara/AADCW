package com.example.aadCw.Controller;

import com.example.aadCw.Dto.impl.EquipmentDto;
import com.example.aadCw.Dto.impl.FieldDto;
import com.example.aadCw.Exception.EquipmentNotFoundException;
import com.example.aadCw.Exception.VehicleNotFoundException;
import com.example.aadCw.Service.EquipmentService;
import com.example.aadCw.util.RegexUtilForId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/equipments")
@CrossOrigin

public class EquipmentController {
    @Autowired
    private EquipmentService equipmentService;
    @PostMapping
    public ResponseEntity<EquipmentDto> saveEquipment(@RequestBody EquipmentDto equipmentDto) {
        EquipmentDto createdEquipment = equipmentService.save(equipmentDto);
        return new ResponseEntity<>(createdEquipment, HttpStatus.CREATED);
    }
    @PutMapping("/{equipmentId}")
    public ResponseEntity<EquipmentDto> updateEquipment(@PathVariable String equipmentId, @RequestBody EquipmentDto equipmentDto) {
        EquipmentDto updatedEquipment = equipmentService.update(equipmentId, equipmentDto);
        return ResponseEntity.ok(updatedEquipment);
    }
    @DeleteMapping("/{equipmentId}")
    public ResponseEntity<String> deleteEquipment(@PathVariable("equipmentId") String equipmentId) {
        try{
            if (!RegexUtilForId.isValidEquipmentId(equipmentId)){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                equipmentService.delete(equipmentId);
                return new ResponseEntity<>("Equipment deleted successfully.", HttpStatus.NO_CONTENT);
            }
        }catch (EquipmentNotFoundException e){
            return new ResponseEntity<>("Equipment not found.", HttpStatus.NOT_FOUND);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }
    @GetMapping("/{equipmentId}")
    public ResponseEntity<EquipmentDto> getEquipmentById(@PathVariable String equipmentId) {
        EquipmentDto equipment = equipmentService.findById(equipmentId);
        return ResponseEntity.ok(equipment);
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<EquipmentDto>> getEquipmentByStaffId(@PathVariable String staffId) {
        List<EquipmentDto> equipmentList = equipmentService.getEquipmentByStaffId(staffId);
        return ResponseEntity.ok(equipmentList);
    }

    @GetMapping("/field/{fieldId}")
    public ResponseEntity<List<EquipmentDto>> getEquipmentByFieldId(@PathVariable String fieldId) {
        List<EquipmentDto> equipmentList = equipmentService.getEquipmentByFieldId(fieldId);
        return ResponseEntity.ok(equipmentList);
    }
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<EquipmentDto> getAllUsers(){
        return equipmentService.findAll();
    }
}
