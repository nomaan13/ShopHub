package com.shophub.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.shophub.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategory_Name(String categoryName, Pageable pageable);



    List<Product> findByNameContainingIgnoreCase(String keyword);
}
