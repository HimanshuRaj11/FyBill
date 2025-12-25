'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '@/Components/ui/input';
import { X, Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/Components/ui/alert-dialog';
import { Skeleton } from '@/Components/ui/skeleton';
import MultipleProductUpdate from '@/Components/Main/MultiProductEdit';
import DownloadExcel from '@/Components/Other/DownloadExcel';
import { FetchProductsList } from '@/app/Redux/Slice/Products.slice';

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
    const dispatch = useDispatch();
    const { Company } = useSelector((state: any) => state.Company);

    const { Products, loading } = useSelector((state: any) => state.Products);

    const [productName, setProductName] = useState('');
    const [debouncedProductName] = useDebounce(productName, 300);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<string[]>([]);
    const [filteredProductsList, setFilteredProductList] = useState<Product[]>([]);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [updateAllView, setUpdateAllView] = useState(false)

    // Fetch products
    const fetchProducts = useCallback(async () => {
        try {
            setFilteredProductList(Products);
            const uniqueCategories = [...new Set(Products?.map((product: Product) => product.category))];
            setCategories(uniqueCategories as string[]);
        } catch (error) {
            toast.error('Failed to fetch products');
        }
    }, [Products]);

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
        if (!Products?.length) return;

        let filtered = [...Products];

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
    }, [Products, debouncedProductName, selectedCategory]);

    // Fetch products on mount
    useEffect(() => {
        if (!Products) {
            dispatch(FetchProductsList() as any);
        }
        fetchProducts();
    }, [fetchProducts]);

    // Clear search
    const clearSearch = () => {
        setProductName('');
    };

    // Skeleton loader for table rows
    const renderSkeletonRows = () => (
        Array(5).fill(0).map((_, index) => (
            <tr key={index} className="border-b dark:border-gray-700">
                <td className="p-4"><Skeleton className="h-6 w-3/4 dark:bg-gray-700" /></td>
                {Company?.branch.length > 0 && <td className="p-4"><Skeleton className="h-6 w-1/2 dark:bg-gray-700" /></td>}
                <td className="p-4"><Skeleton className="h-6 w-1/2 dark:bg-gray-700" /></td>
                <td className="p-4"><Skeleton className="h-6 w-1/4 dark:bg-gray-700" /></td>
                <td className="p-4"><Skeleton className="h-10 w-32 dark:bg-gray-700" /></td>
            </tr>
        ))
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="w-full max-w-7xl px-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                                    <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Product Name</th>
                                    {Company?.branch.length > 0 && <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Branch</th>}
                                    <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Category</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Price</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody>{renderSkeletonRows()}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header with Add Product Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Manage your product inventory
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200">
                            <Link href="/Products/add" className="flex items-center gap-2">
                                <span className="text-lg">+</span>
                                Add Product
                            </Link>
                        </Button>
                        {
                            updateAllView ?
                                <Button
                                    className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                                    onClick={() => setUpdateAllView(false)}
                                >
                                    Back
                                </Button>
                                :
                                <>
                                    <DownloadExcel data={filteredProductsList} fileName={'Products'} />
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                                        onClick={() => setUpdateAllView(true)}
                                    >
                                        <FiEdit2 className="mr-2" />
                                        Update Multiple
                                    </Button>
                                </>
                        }
                    </div>
                </div>

                {/* Search and Category Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                        <Input
                            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                            placeholder="Search products..."
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            aria-label="Search products"
                        />
                        {productName && (
                            <X
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                                aria-label="Clear search"
                            />
                        )}
                    </div>
                    <div className="relative w-full sm:w-64">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 py-2.5 px-4 text-sm text-gray-900 dark:text-white appearance-none transition-all duration-200 cursor-pointer"
                            aria-label="Filter by category"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
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
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 sticky top-0 z-10">
                                        <tr>
                                            <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Product Name</th>
                                            {Company?.branch.length > 0 && <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Branch</th>}
                                            <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Category</th>
                                            <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Price</th>
                                            <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProductsList?.length === 0 ? (
                                            <tr>
                                                <td colSpan={Company?.branch.length > 0 ? 5 : 4} className="p-12 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="text-gray-400 dark:text-gray-500 mb-2">
                                                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-gray-500 dark:text-gray-400 font-medium">No products found</p>
                                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredProductsList?.map((product, index) => (
                                                <tr
                                                    key={product._id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-150"
                                                >
                                                    <td className="p-4 text-gray-900 dark:text-gray-100 font-medium">{product.name}</td>
                                                    {Company?.branch.length > 0 && (
                                                        <td className="p-4 text-gray-600 dark:text-gray-400">{product?.branchId?.branchName}</td>
                                                    )}
                                                    <td className="p-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                            {product.category}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-blue-600 dark:text-blue-400 font-semibold">
                                                        {Company?.currency.symbol} {product.price.toFixed(2)}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                className="flex items-center gap-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
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
                                                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors duration-200"
                                                                        disabled={deletingId === product._id}
                                                                    >
                                                                        <FiTrash2 className="w-4 h-4" />
                                                                        {deletingId === product._id ? 'Deleting...' : 'Delete'}
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle className="text-gray-900 dark:text-white">Delete Product</AlertDialogTitle>
                                                                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                                                            Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{product.name}</span>? This action cannot be undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
                                                                            Cancel
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => deleteProduct(product._id)}
                                                                            className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white"
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

                            {/* Results count footer */}
                            {filteredProductsList?.length > 0 && (
                                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredProductsList.length}</span> product{filteredProductsList.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            )}
                        </div>
                    )
                }
            </div>
        </div>
    );
}