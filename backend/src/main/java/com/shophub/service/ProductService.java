package com.shophub.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.shophub.model.Product;

public interface ProductService {

    // Pagination
    Page<Product> getAllProducts(int page, int size);

    Page<Product> getProductsByCategory(String categoryName, int page, int size);

    // Single product
    Product getProductById(Long id);

    // Create
    Product saveProduct(Product product);

    // Update
    Product updateProduct(Long id, Product product);

    // Delete
    void deleteProduct(Long id);

    // Search
    List<Product> searchProducts(String keyword);
    
	
	List<Product> getAllProductsForAdmin();



}
