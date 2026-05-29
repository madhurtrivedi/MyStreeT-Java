package com.mystreet.controller;

import com.mystreet.dto.OrderDTOs.*;
import com.mystreet.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final OrderService orderService;

    // POST /api/orders — place a new order (authenticated)
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
        @AuthenticationPrincipal UserDetails userDetails,
        @Valid @RequestBody PlaceOrderRequest request
    ) {
        logger.info("POST /api/orders - User: {}", userDetails.getUsername());
        logger.debug("Order request: items={}, shipping={}, paymentMode={}",
            request.items().size(), request.shippingAddress(), request.paymentMode());

        OrderResponse order = orderService.placeOrder(userDetails.getUsername(), request);
        logger.info("Order created successfully: {}", order.id());
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    // GET /api/orders/mine — get current user's orders
    @GetMapping("/mine")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        logger.info("GET /api/orders/mine - User: {}", userDetails.getUsername());
        return ResponseEntity.ok(orderService.getMyOrders(userDetails.getUsername()));
    }

    // GET /api/orders/{id} — get specific order (owner or admin)
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable UUID id
    ) {
        logger.info("GET /api/orders/{} - User: {}", id, userDetails.getUsername());
        return ResponseEntity.ok(orderService.getOrderById(userDetails.getUsername(), id));
    }
}
