package com.dashboard.dashboard.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import com.dashboard.dashboard.enums.TransactionType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    private Double amount;

    @NotNull
    private Double price;

    private Double totalValue;

    @NotNull
    private TransactionType type;

    @NotNull
    private LocalDate date;

    @NotBlank
    private Long categoryId;

    private String description;
}
