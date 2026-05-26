package com.mystreet.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private UUID id;
    private String name;
    private String brand;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String sizesCsv;
    private Integer stockQty;
}