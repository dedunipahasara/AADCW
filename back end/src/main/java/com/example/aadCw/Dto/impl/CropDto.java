package com.example.aadCw.Dto.impl;


import com.example.aadCw.Dto.CropStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CropDto implements CropStatus {
    private String id;
    private String commonName;
    private String specificName;
    private String category;
    private String season;
    private String image1;
    private String fieldId;

}
