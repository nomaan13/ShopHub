
package com.shophub.service;

import java.util.List;

import com.shophub.model.Product;

public interface ProductService {

    List<Product> getAllProducts();

    Product getProductById(Long id);

    List<Product> getProductsByCategory(String categoryName);

    Product saveProduct(Product product);
}
