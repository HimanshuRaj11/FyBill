'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Input } from '@/Components/ui/input';
import { X } from 'lucide-react';
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
    const [productName, setProductName] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<string[]>([]);


    const [filterSearchProducts, setFilterSearchProducts] = useState<any[]>([]);
    const [filterCategoryProducts, setFilterCategoryProducts] = useState<any[]>([]);

    const [FilteredProductsList, setFilteredProductList] = useState<Product[]>([]);

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
    const handleProductSearch = (searchTerm: string) => {
        if (searchTerm == "") {
            setFilterSearchProducts(products)
        }
        setProductName(searchTerm);
        const filtered = products?.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilterSearchProducts(filtered)
    }
    const handleCategoryFilter = (e: any) => {
        setSelectedCategory(e.target.value)
        const filteredProducts = selectedCategory === 'all'
            ? products
            : products.filter(product => product.category === selectedCategory);

        setFilterCategoryProducts(filteredProducts)
    }

    const handleFilteredProduct = useCallback(() => {
        setFilteredProductList(filterSearchProducts || filterCategoryProducts);
    }, [filterSearchProducts, filterCategoryProducts]);

    useEffect(() => {
        handleFilteredProduct()
    }, [handleFilteredProduct])


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
    const ClearSearch = () => {
        setProductName("")
        handleProductSearch("")
    }
    useEffect(() => {
        fetchProducts();
    }, []);



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

            <div className="w-full flex justify-end mb-4">
                <Button>
                    <Link href="/Products/add">Add Product</Link>
                </Button>
            </div>


            <div className="w-full border-t border-gray-800 my-4"></div>
            <div className="flex">
                <div className="relative w-full mb-4">
                    <Input
                        placeholder="Search Products"
                        value={productName}
                        onChange={(e) => handleProductSearch(e.target.value)}
                    />
                    <X onClick={ClearSearch} className="absolute right-2 top-1.5 cursor-pointer text-gray-700 hover:text-black " />
                </div>
            </div>
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-center">
                    <div className="relative inline-block w-64">
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryFilter(e)}
                            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="all">All Products</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
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
                                <th className="p-4 text-left">Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {FilteredProductsList.map((product) => (
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


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}