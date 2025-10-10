package com.dashboard.dashboard.dtos;

import com.dashboard.dashboard.enums.TransactionType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotNull
    private TransactionType type;
}
