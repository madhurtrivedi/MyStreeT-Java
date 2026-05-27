package com.mystreet.backend;

import com.mystreet.backend.model.Product;
import com.mystreet.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return; // Don't seed if data exists

        List<Product> products = List.of(
                Product.builder().name("Air Max 90").brand("Nike")
                        .description("Classic retro vibe with iconic waffle sole and Max Air cushioning.")
                        .price(new BigDecimal("119.99"))
                        .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779877416/img1_h6efck.png")
                        .sizesCsv("7,8,9,10,11").stockQty(50).build(),

                Product.builder().name("Ultraboost 22").brand("Adidas")
                        .description("Responsive Boost cushioning for all-day energy return.")
                        .price(new BigDecimal("139.99"))
                        .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779878934/img2_cgtwmn.png")
                        .sizesCsv("7,8,9,10,11,12").stockQty(35).build(),

                Product.builder().name("Chuck Taylor All Star").brand("Converse")
                        .description("The original sneaker. Timeless canvas design since 1917.")
                        .price(new BigDecimal("59.99"))
                        .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779879526/img3_b71vfj.png")
                        .sizesCsv("6,7,8,9,10,11").stockQty(80).build(),

                Product.builder().name("Old Skool").brand("Vans")
                        .description("Low-top lace-up with iconic side stripe and padded collar.")
                        .price(new BigDecimal("69.99"))
                        .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779879617/img4_a4nam2.png")
                        .sizesCsv("7,8,9,10").stockQty(60).build(),

                Product.builder().name("RS-X3").brand("Puma")
                        .description("Bold chunky sole with retro running DNA and modern comfort.")
                        .price(new BigDecimal("89.99"))
                        .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779879708/img5_n23joq.png")
                        .sizesCsv("8,9,10,11").stockQty(40).build(),

                Product.builder().name("Air Force 1").brand("Nike")
                        .description("The legend lives on. Clean leather upper, timeless silhouette.")
                        .price(new BigDecimal("109.99"))
                        .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779879870/img6_fcan5b.png")
                        .sizesCsv("7,8,9,10,11,12").stockQty(45).build(),

                Product.builder().name("Stan Smith").brand("Adidas")
                        .description("Clean minimal tennis shoe that became a streetwear icon.")
                        .price(new BigDecimal("84.99"))
                        .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779880020/img7_hxmdes.png")
                        .sizesCsv("6,7,8,9,10").stockQty(55).build(),

                Product.builder().name("Classic Leather").brand("Reebok")
                        .description("Soft leather upper with die-cut EVA midsole for lightweight cushioning.")
                        .price(new BigDecimal("74.99"))
                        .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779880111/img8_dwnnnv.png")
                        .sizesCsv("7,8,9,10,11").stockQty(30).build()
        );

        productRepository.saveAll(products);
        System.out.println("✅ Seeded " + products.size() + " products.");
    }
}