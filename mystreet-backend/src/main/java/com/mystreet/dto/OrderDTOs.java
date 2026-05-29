package com.mystreet.dto;

import com.mystreet.model.Order;
import com.mystreet.model.OrderItem;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class OrderDTOs {

    // ── Place Order Request ───────────────────────────────────────────────────

    public record PlaceOrderRequest(
        @NotEmpty(message = "Order must have at least one item")
        @Valid
        List<OrderItemRequest> items,

        @NotBlank(message = "Shipping address is required")
        String shippingAddress,

        @NotBlank(message = "Payment mode is required")
        @Pattern(
            regexp = "CASH_ON_DELIVERY|MOCK_UPI",
            message = "Payment mode must be CASH_ON_DELIVERY or MOCK_UPI"
        )
        String paymentMode
    ) {}

    public record OrderItemRequest(
        @NotNull(message = "Product ID is required")
        UUID productId,

        @NotBlank(message = "Size is required")
        String size,

        @Min(value = 1, message = "Quantity must be at least 1")
        int quantity,

        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
        double price
    ) {}

    // ── Order Response ────────────────────────────────────────────────────────

    public record OrderResponse(
        UUID id,
        String status,
        String shippingAddress,
        String paymentMode,
        Double totalAmount,
        List<OrderItemResponse> items,
        Instant createdAt
    ) {
        // Static factory — maps Order entity → OrderResponse
        public static OrderResponse from(Order order) {
            List<OrderItemResponse> itemResponses = order.getItems()
                .stream()
                .map(OrderItemResponse::from)
                .toList();

            return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getShippingAddress(),
                order.getPaymentMode(),
                order.getTotalAmount(),
                itemResponses,
                order.getCreatedAt()
            );
        }
    }

    public record OrderItemResponse(
        UUID productId,
        String productName,   // from Product entity — needed by frontend
        String imageUrl,      // from Product entity — needed by frontend
        String size,
        Integer quantity,
        Double price
    ) {
        public static OrderItemResponse from(OrderItem item) {
            return new OrderItemResponse(
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getImageUrl(),
                item.getSize(),
                item.getQuantity(),
                item.getPrice()
            );
        }
    }
}
