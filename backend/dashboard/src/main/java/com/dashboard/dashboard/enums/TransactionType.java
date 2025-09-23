package com.dashboard.dashboard.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum TransactionType {
    @JsonProperty("expense")
    EXPENSE,
    
    @JsonProperty("income")
    INCOME
}
