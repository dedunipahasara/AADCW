package com.example.aadCw.Controller;

import com.example.aadCw.Dto.impl.FieldDto;
import com.example.aadCw.Dto.impl.StaffDto;
import com.example.aadCw.Exception.FieldNotFoundException;
import com.example.aadCw.Exception.StaffNotFoundException;
import com.example.aadCw.Service.StaffService;
import com.example.aadCw.util.RegexUtilForId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/staffs")
@CrossOrigin
public class StaffController {
    @Autowired
    private StaffService staffService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR') or hasRole('SCIENTIST')")
    public ResponseEntity<StaffDto> saveStaff(@RequestBody StaffDto staffDto) {
        StaffDto savedStaff = staffService.save(staffDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStaff);
    }

    @PutMapping(value = "/{staffId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR') or hasRole('SCIENTIST')")
    public ResponseEntity<StaffDto> updateStaff(@PathVariable("staffId") String staffId, @RequestBody StaffDto staffDto) {
        StaffDto updatedStaff = staffService.update(staffId, staffDto);
        return ResponseEntity.ok(updatedStaff);
    }

    @DeleteMapping("/{staffId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR') or hasRole('SCIENTIST')")
    public ResponseEntity<String> deleteStaff(@PathVariable("staffId") String staffId) {
        try{
            if (!RegexUtilForId.isValidStaffId(staffId)){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                staffService.delete(staffId);
                return new ResponseEntity<>("Staff deleted successfully.", HttpStatus.NO_CONTENT);
            }
        }catch (StaffNotFoundException e){
            return new ResponseEntity<>("Staff not found.", HttpStatus.NOT_FOUND);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<StaffDto> getAllUsers(){
        return staffService.findAll();
    }

    @GetMapping(value = "/{staffId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getFieldById(@PathVariable("staffId") String staffId) {
        // Validate field ID format using RegexUtilForId
        if (!RegexUtilForId.isValidStaffId(staffId)) {
            return new ResponseEntity<>( "Staff ID format is invalid", HttpStatus.BAD_REQUEST);
        }

        // Retrieve the field
        StaffDto staffDto = staffService.findById(staffId);
        if (staffDto == null) {
            return new ResponseEntity<>( "Staff not found", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(staffDto, HttpStatus.OK);
    }

    @GetMapping("/{staffId}/field")
    public ResponseEntity<List<FieldDto>> getFieldsOfStaffId(@PathVariable("staffId") String staffId) {
        List<FieldDto> fieldDtos = staffService.getFieldsOfStaffId(staffId);
        return ResponseEntity.ok(fieldDtos);
    }


}
