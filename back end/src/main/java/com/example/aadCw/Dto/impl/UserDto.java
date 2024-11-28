package com.example.aadCw.Dto.impl;


import com.example.aadCw.Dto.StaffStatus;
import com.example.aadCw.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDto implements StaffStatus {
    private String id;
    private String email;
    private String password;
    private Role role;
    private String staffId;

}
