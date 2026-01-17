package com.shophub.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.shophub.model.Product;

public interface ProductService {

    // Pagination
    Page<Product> getAllProducts(int page, int size);

//    Page<Product> getProductsByCategory(String categoryName, int page, int size);
    Page<Product> findByCategory_NameIgnoreCase(String categoryName, Pageable pageable);

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

	Page<Product> getProductsByCategory(String categoryName, int page, int size);
	
	

	




}
