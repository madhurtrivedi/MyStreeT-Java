package com.mystreet.service;

import com.mystreet.dto.OrderDTOs.*;
import com.mystreet.model.Order;
import com.mystreet.model.OrderItem;
import com.mystreet.model.Product;
import com.mystreet.model.User;
import com.mystreet.exception.ResourceNotFoundException;
import com.mystreet.exception.UnauthorizedException;
import com.mystreet.repository.OrderRepository;
import com.mystreet.repository.ProductRepository;
import com.mystreet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // ── Place Order ───────────────────────────────────────────────────────────
    @Transactional
    public OrderResponse placeOrder(String userEmail, PlaceOrderRequest request) {
        try {
            logger.info("Starting order placement for user: {}", userEmail);
            logger.debug("Order request with {} items", request.items().size());

            // Validate user exists
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> {
                        logger.error("User not found with email: {}", userEmail);
                        return new ResourceNotFoundException("User not found");
                    });
            logger.debug("User found with ID: {}", user.getId());

            // Create order with required fields
            Order order = new Order();
            order.setUser(user);
            order.setShippingAddress(request.shippingAddress());
            order.setPaymentMode(request.paymentMode());
            order.setStatus("PLACED");
            order.setTotalAmount(0.0); // Initialize to 0, will update

            double total = 0.0;

            // Process each item
            for (OrderItemRequest itemReq : request.items()) {
                logger.debug("Processing item - ProductId: {}, Quantity: {}, Size: {}, Price: {}",
                    itemReq.productId(), itemReq.quantity(), itemReq.size(), itemReq.price());

                // Validate product exists
                Product product = productRepository.findById(itemReq.productId())
                        .orElseThrow(() -> {
                            logger.error("Product not found with ID: {}", itemReq.productId());
                            return new ResourceNotFoundException("Product not found: " + itemReq.productId());
                        });
                logger.debug("Product found: '{}', Current stock: {}", product.getName(), product.getStockQty());

                // Check stock availability
                if (product.getStockQty() < itemReq.quantity()) {
                    logger.warn("Insufficient stock for product '{}': requested={}, available={}",
                        product.getName(), itemReq.quantity(), product.getStockQty());
                    throw new IllegalArgumentException(
                            "Insufficient stock for product: " + product.getName());
                }

                // Decrement and persist product stock
                product.setStockQty(product.getStockQty() - itemReq.quantity());
                productRepository.save(product);
                productRepository.flush(); // Ensure stock update is persisted
                logger.debug("Product stock updated: {} → {}",
                    product.getStockQty() + itemReq.quantity(), product.getStockQty());

                // Create order item
                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setProduct(product);
                item.setSize(itemReq.size());
                item.setQuantity(itemReq.quantity());
                item.setPrice(itemReq.price()); // snapshot price at time of order

                order.getItems().add(item);
                total += itemReq.price() * itemReq.quantity();
                logger.debug("Item added to order, running total: {}", total);
            }

            // Set final total and persist order
            order.setTotalAmount(total);
            logger.info("Order total amount calculated: {}", total);

            Order saved = orderRepository.save(order);
            orderRepository.flush(); // Ensure order and items are persisted
            logger.info("Order persisted successfully with ID: {} for user: {}", saved.getId(), userEmail);

            return OrderResponse.from(saved);
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found error: {}", e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            logger.error("Validation error: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error placing order for user {}: {}", userEmail, e.getMessage(), e);
            throw e;
        }
    }

    // ── Get My Orders ─────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return orderRepository.findByUserWithItems(user)
            .stream()
            .map(OrderResponse::from)
            .toList();
    }

    // ── Get Order By ID ───────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String userEmail, UUID orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        // Users can only see their own orders; admins can see any
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!order.getUser().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new UnauthorizedException("Access denied");
        }

        return OrderResponse.from(order);
    }
}
