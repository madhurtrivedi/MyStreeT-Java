package com.mystreet.repository;

import com.mystreet.model.Order;
import com.mystreet.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    // Fetch all orders for a user, newest first
    // Eagerly fetch items + product in one query to avoid N+1
    @Query("""
        SELECT DISTINCT o FROM Order o
        LEFT JOIN FETCH o.items i
        LEFT JOIN FETCH i.product
        WHERE o.user = :user
        ORDER BY o.createdAt DESC
    """)
    List<Order> findByUserWithItems(User user);
}
