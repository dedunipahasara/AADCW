package com.example.aadCw.Dto.impl;


import com.example.aadCw.Dto.StaffStatus;
import com.example.aadCw.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StaffDto implements StaffStatus {
    private String staffId;
    private String firstName;
    private String lastName;
    private String gender;
    private String designation;
    private String email;
    private Date dob;
    private String address;
    private String contact;
    private Date joinDate;
    private Role role;
    private List<String> fieldIds;
}
