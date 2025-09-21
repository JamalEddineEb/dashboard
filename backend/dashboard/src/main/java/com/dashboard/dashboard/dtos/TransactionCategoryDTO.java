package com.dashboard.dashboard.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor 
public class TransactionCategoryDTO {
    private Long id;

    @NotBlank
    private String name;
}
