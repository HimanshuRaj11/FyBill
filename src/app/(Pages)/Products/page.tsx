'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';

// TypeScript interface for Product
interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<string[]>([]);

    // Fetch products from an API (using fake store API as an example)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('https://fakestoreapi.com/products');
                const data = res.data;
                setProducts(data);
                console.log(data)
                // Extract unique categories
                const uniqueCategories = [...new Set(data.map((product: Product) => product.category))];
                setCategories(uniqueCategories as string[]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(product => product.category === selectedCategory);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            {/* Category Filter */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-wrap gap-2 justify-center">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                            ${selectedCategory === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-blue-50'}`}
                    >
                        All Products
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                                ${selectedCategory === category
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-blue-50'}`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="relative h-64 w-full">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="object-contain p-4 w-full aspect-square"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                                    {product.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                    {product.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-blue-600">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <div className="flex items-center">
                                        <span className="text-yellow-400 mr-1">★</span>
                                        <span className="text-sm text-gray-600">
                                            {product.rating.rate} ({product.rating.count})
                                        </span>
                                    </div>
                                </div>
                                <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}