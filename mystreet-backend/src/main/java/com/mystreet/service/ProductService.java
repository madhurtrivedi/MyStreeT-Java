package com.mystreet.service;

import com.mystreet.dto.ProductDTO;
import com.mystreet.model.Product;
import com.mystreet.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // Get all products with optional filters
    public List<ProductDTO> getProducts(String brand, String size) {
        List<Product> products;

        if (brand != null && size != null) {
            products = productRepository.findByBrandIgnoreCaseAndSize(brand, size);
        } else if (brand != null) {
            products = productRepository.findByBrandIgnoreCase(brand);
        } else if (size != null) {
            products = productRepository.findBySize(size);
        } else {
            products = productRepository.findAll();
        }

        return products.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Get single product by ID
    public ProductDTO getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return toDTO(product);
    }

    // Save product (used by seed + admin later)
    public ProductDTO saveProduct(Product product) {
        return toDTO(productRepository.save(product));
    }

    // Convert Entity → DTO
    private ProductDTO toDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .brand(product.getBrand())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .sizesCsv(product.getSizesCsv())
                .stockQty(product.getStockQty())
                .build();
    }
}