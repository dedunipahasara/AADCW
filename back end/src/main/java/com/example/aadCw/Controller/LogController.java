package com.example.aadCw.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.aadCw.Dto.impl.FieldDto;
import com.example.aadCw.Dto.impl.LogDto;
import com.example.aadCw.Exception.FieldNotFoundException;
import com.example.aadCw.Service.LogService;
import com.example.aadCw.util.AppUtil;
import com.example.aadCw.util.RegexUtilForId;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/v1/logs")
@CrossOrigin
public class LogController {
    @Autowired
    private LogService logService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LogDto> saveLog(@RequestParam("logData") String logData,
                                          @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {
        try {
            // Convert JSON string to LogDto object
            ObjectMapper objectMapper = new ObjectMapper();
            LogDto dto = objectMapper.readValue(logData, LogDto.class);
            System.out.println(logData);

            // Convert image to Base64 if provided
            if (imageFile != null) {
                dto.setImage2(AppUtil.imageToBase64(imageFile.getBytes()));
            }

            // Save the log and return the response
            LogDto savedLog = logService.save(dto);
            return new ResponseEntity<>(savedLog, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

        // Update log
        @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<String> updateField(
                @PathVariable("id") String logId,
                @RequestParam("logData") String logData,
                @RequestParam(value = "imageFile", required = false) MultipartFile imageFile)
               {

            try {
                // Convert fieldData JSON string to FieldDto object
                ObjectMapper objectMapper = new ObjectMapper();
                LogDto logDto = objectMapper.readValue(logData, LogDto.class);

                // Convert images to Base64 if provided and set them in the DTO
                if (imageFile != null && !imageFile.isEmpty()) {
                    logDto.setImage2(AppUtil.imageToBase64(imageFile.getBytes()));
                }


                // Call the service to update the field
                logService.update(logId, logDto);

                return ResponseEntity.status(HttpStatus.OK).body("Log updated successfully");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating Log: " + e.getMessage());
            }
        }

    @DeleteMapping("/{logId}")
    public ResponseEntity<String> deleteField(@PathVariable("logId") String logId) {
        try{
            if (!RegexUtilForId.isValidLogId(logId)){
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            } else {
                logService.delete(logId);
                return new ResponseEntity<>("Log deleted successfully.", HttpStatus.NO_CONTENT);
            }
        }catch (FieldNotFoundException e){
            return new ResponseEntity<>("Log not found.", HttpStatus.NOT_FOUND);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<LogDto> getAllUsers(){
        return logService.findAll();
    }

    @GetMapping(value = "/{logId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getFieldById(@PathVariable("logId") String fieldId) {
        // Validate field ID format using RegexUtilForId
        if (!RegexUtilForId.isValidLogId(fieldId)) {
            return new ResponseEntity<>( "Log ID format is invalid", HttpStatus.BAD_REQUEST);
        }

        // Retrieve the field
        LogDto logDto = logService.findById(fieldId);
        if (logDto == null) {
            return new ResponseEntity<>( "Log not found", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(logDto, HttpStatus.OK);
    }

}


