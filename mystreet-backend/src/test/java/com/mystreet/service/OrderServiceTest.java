package com.mystreet.service;

import com.mystreet.dto.OrderDTOs.*;
import com.mystreet.model.Order;
import com.mystreet.model.Product;
import com.mystreet.model.User;
import com.mystreet.exception.ResourceNotFoundException;
import com.mystreet.exception.UnauthorizedException;
import com.mystreet.repository.OrderRepository;
import com.mystreet.repository.ProductRepository;
import com.mystreet.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private UserRepository userRepository;
    @Mock private ProductRepository productRepository;

    @InjectMocks private OrderService orderService;

    private User testUser;
    private Product testProduct;
    private UUID productId;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("user@test.com");
        testUser.setAdmin(false);

        productId = UUID.randomUUID();
        testProduct = new Product();
        testProduct.setId(productId);
        testProduct.setName("Air Max 90");
        testProduct.setImageUrl("https://example.com/img.jpg");
        testProduct.setStockQty(10);
    }

    // ── placeOrder ────────────────────────────────────────────────────────────

    @Test
    void placeOrder_success_returnsOrderResponse() {
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            o.setId(UUID.randomUUID());
            return o;
        });

        PlaceOrderRequest request = new PlaceOrderRequest(
            List.of(new OrderItemRequest(productId, "9", 2, 119.99)),
            "123 Main St, Mumbai",
            "CASH_ON_DELIVERY"
        );

        OrderResponse response = orderService.placeOrder("user@test.com", request);

        assertThat(response).isNotNull();
        assertThat(response.status()).isEqualTo("PLACED");
        assertThat(response.totalAmount()).isEqualTo(239.98);
        assertThat(response.items()).hasSize(1);
        verify(productRepository).save(testProduct); // stock decremented
        assertThat(testProduct.getStockQty()).isEqualTo(8);
    }

    @Test
    void placeOrder_insufficientStock_throwsException() {
        testProduct.setStockQty(1);
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(productRepository.findById(productId)).thenReturn(Optional.of(testProduct));

        PlaceOrderRequest request = new PlaceOrderRequest(
            List.of(new OrderItemRequest(productId, "9", 5, 119.99)),
            "123 Main St",
            "MOCK_UPI"
        );

        assertThatThrownBy(() -> orderService.placeOrder("user@test.com", request))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Insufficient stock");
    }

    @Test
    void placeOrder_unknownProduct_throwsResourceNotFoundException() {
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(productRepository.findById(any())).thenReturn(Optional.empty());

        PlaceOrderRequest request = new PlaceOrderRequest(
            List.of(new OrderItemRequest(UUID.randomUUID(), "9", 1, 99.99)),
            "123 Main St",
            "CASH_ON_DELIVERY"
        );

        assertThatThrownBy(() -> orderService.placeOrder("user@test.com", request))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    // ── getMyOrders ───────────────────────────────────────────────────────────

    @Test
    void getMyOrders_returnsListForUser() {
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(orderRepository.findByUserWithItems(testUser)).thenReturn(List.of());

        List<OrderResponse> result = orderService.getMyOrders("user@test.com");

        assertThat(result).isEmpty();
        verify(orderRepository).findByUserWithItems(testUser);
    }

    // ── getOrderById ──────────────────────────────────────────────────────────

    @Test
    void getOrderById_differentUser_throwsUnauthorizedException() {
        UUID orderId = UUID.randomUUID();

        User otherUser = new User();
        otherUser.setId(UUID.randomUUID());
        otherUser.setEmail("other@test.com");
        otherUser.setAdmin(false);

        Order order = new Order();
        order.setId(orderId);
        order.setUser(otherUser); // owned by someone else

        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(testUser));
        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> orderService.getOrderById("user@test.com", orderId))
            .isInstanceOf(UnauthorizedException.class);
    }
}
