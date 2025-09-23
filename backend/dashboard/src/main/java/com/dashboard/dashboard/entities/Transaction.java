
package com.dashboard.dashboard.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

import com.dashboard.dashboard.enums.TransactionType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    private Double amount;

    @NotNull
    private Double price;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @NotNull
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @NotNull
    private TransactionCategory category;

    private String description;

    @Transient
    public Double getTotalValue() {
        return (amount != null && price != null) ? amount * price : null;
    }

}
