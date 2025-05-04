'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
// TypeScript interface for Product
interface Product {
    _id: string;
    price: number;
    description: string;
    category: string;
    name: string;
    branchId: any
}

export default function ProductsPage() {
    const { User } = useSelector((state: any) => state.User);
    const { Company } = useSelector((state: any) => state.Company);
    const [products, setProducts] = useState<Product[]>([]);


    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<string[]>([]);

    const deleteProduct = async (id: string) => {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/delete`, { _id: id });
        const data = res.data;
        if (data.success) {
            toast.success(data.message);
            fetchProducts();
        } else {
            toast.error(data.error);
        }
    }

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/fetch`);
            const data = res.data;
            setProducts(data.products);

            const uniqueCategories = [...new Set(data.products.map((product: Product) => product.category))];
            setCategories(uniqueCategories as string[]);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
    useEffect(() => {
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
        <div className=" min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            {/* Category Filter */}
            {User?.role === "Owner" || User?.role === "admin" && (
                <div className="w-full flex justify-end mb-4">
                    <Button>
                        <Link href="/Products/add">Add Product</Link>
                    </Button>
                </div>
            )}

            <div className="w-full border-t border-gray-800 my-4"></div>

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
            <div className="w-full mx-auto">
                <div className="">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className=''>
                                <th className="p-4 text-left">Product Name</th>
                                {
                                    Company?.branch.length > 0 && <th className="p-4 text-left">Branch</th>
                                }
                                <th className="p-4 text-left">Category</th>
                                <th className="p-4 text-left">Price</th>
                                {
                                    User.role == "Owner" && (
                                        <th className="p-4 text-left">Actions</th>
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-100 border-b-2">
                                    <td className="px-4">
                                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                                            {product?.name}
                                        </h3>
                                    </td>
                                    {
                                        Company?.branch.length > 0 && <td className="px-4">
                                            <h3 className="text-md text-gray-800 line-clamp-2 mb-2">
                                                {product?.branchId?.branchName}
                                            </h3>
                                        </td>
                                    }
                                    <td className="px-4">
                                        <h3 className="text-md text-gray-800 line-clamp-2 mb-2">
                                            {product?.category}
                                        </h3>
                                    </td>

                                    <td className="px-4">
                                        <span className="text-xl font-bold text-blue-600">
                                            {Company?.currency.symbol} {product.price.toFixed(2)}
                                        </span>
                                    </td>
                                    {
                                        User?.role == "Owner" && (
                                            <td className="px-4">
                                                <div className="flex gap-2">
                                                    <Button variant="default" className="flex items-center justify-center gap-2">
                                                        <Link className='w-full flex items-center justify-center gap-2' href={`/Products/edit/${product._id}`}>
                                                            <FiEdit2 className="w-4 h-4" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button variant="destructive" className="flex items-center justify-center gap-2" onClick={() => deleteProduct(product._id)}>
                                                        <FiTrash2 className="w-4 h-4" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>

                                        )
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}