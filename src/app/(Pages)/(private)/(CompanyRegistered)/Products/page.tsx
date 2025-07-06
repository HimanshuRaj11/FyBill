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
import { useDebounce } from 'use-debounce';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/Components/ui/alert-dialog';
import { Skeleton } from '@/Components/ui/skeleton';
import MultipleProductUpdate from '@/Components/Main/MultiProductEdit';

// TypeScript interface for Product
interface Product {
    _id: string;
    price: number;
    description: string;
    category: string;
    name: string;
    branchId: any;
}


export default function ProductsPage() {
    const { Company } = useSelector((state: any) => state.Company);
    const [products, setProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState('');
    const [debouncedProductName] = useDebounce(productName, 300);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<string[]>([]);
    const [filteredProductsList, setFilteredProductList] = useState<Product[]>([]);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [updateAllView, setUpdateAllView] = useState(false)

    // Fetch products
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/fetch`);
            const data = res.data;
            setProducts(data.products);
            setFilteredProductList(data.products);
            const uniqueCategories = [...new Set(data.products.map((product: Product) => product.category))];
            setCategories(uniqueCategories as string[]);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete product with confirmation
    const deleteProduct = async (id: string) => {
        try {
            setDeletingId(id);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/delete`, { _id: id });
            const data = res.data;
            if (data.success) {
                toast.success(data.message);
                fetchProducts();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Failed to delete product');
        } finally {
            setDeletingId(null);
        }
    };

    // Filtering
    useEffect(() => {
        if (!products.length) return;

        let filtered = [...products];

        // Apply search filter
        if (debouncedProductName.trim() !== '') {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(debouncedProductName.toLowerCase())
            );
        }

        // Apply category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter((product) => product.category === selectedCategory);
        }

        setFilteredProductList(filtered);
    }, [products, debouncedProductName, selectedCategory]);

    // Fetch products on mount
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Clear search
    const clearSearch = () => {
        setProductName('');
    };

    // Skeleton loader for table rows
    const renderSkeletonRows = () => (
        Array(5).fill(0).map((_, index) => (
            <tr key={index} className="border-b">
                <td className="p-4"><Skeleton className="h-6 w-3/4" /></td>
                {Company?.branch.length > 0 && <td className="p-4"><Skeleton className="h-6 w-1/2" /></td>}
                <td className="p-4"><Skeleton className="h-6 w-1/2" /></td>
                <td className="p-4"><Skeleton className="h-6 w-1/4" /></td>
                <td className="p-4"><Skeleton className="h-10 w-32" /></td>
            </tr>
        ))
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-7xl px-4">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-4 text-left text-sm font-medium text-gray-600">Product Name</th>
                                {Company?.branch.length > 0 && <th className="p-4 text-left text-sm font-medium text-gray-600">Branch</th>}
                                <th className="p-4 text-left text-sm font-medium text-gray-600">Category</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-600">Price</th>
                                <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>{renderSkeletonRows()}</tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen ">
            <div className="max-w-7xl mx-auto">
                {/* Header with Add Product Button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 ">Products</h1>
                    <div className="flex gap-2">
                        <Button className="bg-blue-600 hover:bg-blue-900 text-white">
                            <Link href="/Products/add">Add Product</Link>
                        </Button>
                        {
                            updateAllView ?
                                <Button className="bg-black hover:bg-gray-800 text-white" onClick={() => setUpdateAllView(false)}>
                                    Back
                                </Button>
                                :
                                <Button className="bg-green-600 hover:bg-green-900 text-white" onClick={() => setUpdateAllView(true)}>
                                    <FiEdit2 /> Update Multiple
                                </Button>
                        }
                    </div>
                </div>

                {/* Search and Category Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Input
                            className="bg-white border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Search products..."
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            aria-label="Search products"
                        />
                        {productName && (
                            <X
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                                aria-label="Clear search"
                            />
                        )}
                    </div>
                    <div className="relative w-full sm:w-64">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="block w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-2.5 px-4 text-sm appearance-none"
                            aria-label="Filter by category"
                        >
                            <option value="all">All Categories</option>
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

                {/* Products Table */}
                {
                    updateAllView ? (
                        <MultipleProductUpdate initialProducts={filteredProductsList} Company={Company} categories={categories} />
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-100 sticky top-0 z-10">
                                    <tr>
                                        <th className="p-4 text-left text-sm font-medium text-gray-600">Product Name</th>
                                        {Company?.branch.length > 0 && <th className="p-4 text-left text-sm font-medium text-gray-600">Branch</th>}
                                        <th className="p-4 text-left text-sm font-medium text-gray-600">Category</th>
                                        <th className="p-4 text-left text-sm font-medium text-gray-600">Price</th>
                                        <th className="p-4 text-left text-sm font-medium text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProductsList.length === 0 ? (
                                        <tr>
                                            <td colSpan={Company?.branch.length > 0 ? 5 : 4} className="p-4 text-center text-gray-500">
                                                No products found. Try adjusting your search or filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProductsList.map((product) => (
                                            <tr key={product._id} className="hover:bg-gray-50 border-b">
                                                <td className="p-4 text-gray-800">{product.name}</td>
                                                {Company?.branch.length > 0 && (
                                                    <td className="p-4 text-gray-600">{product?.branchId?.branchName}</td>
                                                )}
                                                <td className="p-4 text-gray-600">{product.category}</td>
                                                <td className="p-4 text-blue-600 font-semibold">
                                                    {Company?.currency.symbol} {product.price.toFixed(2)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            className="flex items-center gap-2 border-blue-500 text-blue-500 hover:bg-blue-50"
                                                            asChild
                                                        >
                                                            <Link href={`/Products/edit/${product._id}`}>
                                                                <FiEdit2 className="w-4 h-4" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="destructive"
                                                                    className="flex items-center gap-2"
                                                                    disabled={deletingId === product._id}
                                                                >
                                                                    <FiTrash2 className="w-4 h-4" />
                                                                    {deletingId === product._id ? 'Deleting...' : 'Delete'}
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to delete {product.name}? This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => deleteProduct(product._id)}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )
                }

            </div>
        </div>
    );
}