package com.example.aadCw.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "equipment")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class EquipmentEntity {
    @Id
    private String equipmentId;
    private String type;
    private String name;
    private String status;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "field_id")
    private FieldEntity field;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "staff_id")
    private StaffEntity staff;
}
