package com.shophub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;


import com.shophub.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategory_Name(String categoryName, Pageable pageable);
    
    

    List<Product> findByNameContainingIgnoreCase(String keyword);
}
