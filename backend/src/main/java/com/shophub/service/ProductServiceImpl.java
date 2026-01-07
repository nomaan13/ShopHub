package com.shophub.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.shophub.model.Product;
import com.shophub.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Get all products (pagination)
    @Override
    public Page<Product> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable);
    }

    // Get products by category (pagination)
    @Override
    public Page<Product> getProductsByCategory(String categoryName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByCategory_Name(categoryName, pageable);
    }

    // Get product by ID
    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // Add product
    @Override
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Update product
    @Override
    public Product updateProduct(Long id, Product product) {

        Product existing = productRepository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setName(product.getName());
        existing.setPrice(product.getPrice());
        existing.setDescription(product.getDescription());
        existing.setCategory(product.getCategory());
        existing.setImageUrl(product.getImageUrl());
        existing.setStock(product.getStock());

        return productRepository.save(existing);
    }


    // Delete product
    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Search products
    @Override
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }
}
