package com.mystreet.backend.repository;

import com.mystreet.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    // Filter by brand (case-insensitive)
    List<Product> findByBrandIgnoreCase(String brand);

    // Filter by size — checks if sizesCsv contains the size
    @Query("SELECT p FROM Product p WHERE p.sizesCsv LIKE %:size%")
    List<Product> findBySize(@Param("size") String size);

    // Filter by brand AND size
    @Query("SELECT p FROM Product p WHERE LOWER(p.brand) = LOWER(:brand) AND p.sizesCsv LIKE %:size%")
    List<Product> findByBrandIgnoreCaseAndSize(@Param("brand") String brand, @Param("size") String size);
}