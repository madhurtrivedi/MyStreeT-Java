package com.mystreet;

import com.mystreet.model.Product;
import com.mystreet.model.User;
import com.mystreet.repository.ProductRepository;
import com.mystreet.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataSeeder {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Bean
    CommandLineRunner seedDatabase(
            ProductRepository productRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            // ── Admin user ────────────────────────────────────────────────────
            if (!userRepository.existsByEmail("admin@mystreet.com")) {
                User admin = User.builder()
                        .email("admin@mystreet.com")
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .admin(true)
                        .build();
                userRepository.save(admin);
                log.info("Seeded admin user: admin@mystreet.com / admin123");
            }

            // ── Products ──────────────────────────────────────────────────────
            if (productRepository.count() > 0) {
                log.info("Products already seeded — skipping.");
                return;
            }

            List<Product> products = List.of(
                Product.builder()
                    .name("Air Max 90")
                    .brand("Nike")
                    .description("Classic retro vibe with iconic Max Air cushioning.")
                    .price(new BigDecimal("119.99"))
                    .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779877416/img1_h6efck.png")
                    .sizesCsv("7,8,9,10,11")
                    .stockQty(50)
                    .build(),
                Product.builder()
                    .name("Ultraboost 22")
                    .brand("Adidas")
                    .description("Responsive Boost cushioning for all-day energy return.")
                    .price(new BigDecimal("139.99"))
                    .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779878934/img2_cgtwmn.png")
                    .sizesCsv("7,8,9,10,11,12")
                    .stockQty(35)
                    .build(),
                Product.builder()
                    .name("Chuck Taylor All Star")
                    .brand("Converse")
                    .description("The original canvas sneaker since 1917.")
                    .price(new BigDecimal("65.00"))
                    .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779879526/img3_b71vfj.png")
                    .sizesCsv("6,7,8,9,10,11,12")
                    .stockQty(80)
                    .build(),
                Product.builder()
                    .name("Old Skool")
                    .brand("Vans")
                    .description("Low-top with iconic side stripe, durable suede and canvas.")
                    .price(new BigDecimal("70.00"))
                    .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779879617/img4_a4nam2.png")
                    .sizesCsv("6,7,8,9,10,11")
                    .stockQty(60)
                    .build(),
                Product.builder()
                    .name("Suede Classic")
                    .brand("Puma")
                    .description("Timeless suede upper with the Formstrip branding.")
                    .price(new BigDecimal("75.00"))
                    .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779879708/img5_n23joq.png")
                    .sizesCsv("7,8,9,10,11")
                    .stockQty(45)
                    .build(),
                Product.builder()
                    .name("990v5")
                    .brand("New Balance")
                    .description("Made in USA. Premium mesh and pigskin suede for all-day comfort.")
                    .price(new BigDecimal("184.99"))
                    .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779879870/img6_fcan5b.png")
                    .sizesCsv("7,8,9,10,11,12")
                    .stockQty(25)
                    .build(),
                Product.builder()
                    .name("Classic Leather")
                    .brand("Reebok")
                    .description("Buttery soft leather upper with EVA midsole for lightweight cushioning.")
                    .price(new BigDecimal("85.00"))
                    .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779880020/img7_hxmdes.png")
                    .sizesCsv("7,8,9,10,11")
                    .stockQty(40)
                    .build(),
                Product.builder()
                    .name("Gel-Nimbus 25")
                    .brand("ASICS")
                    .description("Maximum cushioning for long-distance running, featuring GEL technology.")
                    .price(new BigDecimal("159.99"))
                    .imageUrl("https://res.cloudinary.com/dnyzqe4mq/image/upload/v1779880111/img8_dwnnnv.png")
                    .sizesCsv("7,8,9,10,11,12")
                    .stockQty(30)
                    .build()
            );

            productRepository.saveAll(products);
            log.info("Seeded {} products.", products.size());
        };
    }
}
