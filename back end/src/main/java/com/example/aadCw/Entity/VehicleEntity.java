package com.example.aadCw.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehicle")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class VehicleEntity {
    @Id
    private String vehicleId;
    private String plateNumber;
    private String category;
    private String fuelType;
    private String status;
    private String remarks;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "staff_id")
    private StaffEntity staff;

}
