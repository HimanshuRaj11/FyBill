'use client'
import PreLoader from '@/Components/Other/PreLoader';
import axios from 'axios';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

export default function Page({ params }: { params: Promise<{ product_id: string }> }) {
    const { Company } = useSelector((state: any) => state.Company);

    const branches = Company?.branch
    const { product_id } = React.use(params);
    const [product, setProduct] = useState({
        _id: product_id,
        name: '',
        description: '',
        price: 0,
        branchId: "",
        category: "",

    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);

        try {

            await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/update`, { product });
            setSaveSuccess(true);
            setError(null);

            // Reset success message after 3 seconds
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (err: any) {
            setError('Failed to update product. Please try again.');
            console.error('Error updating product:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const goBack = () => {
        window.history.back();
    };

    const fetchProduct = useCallback(async () => {

        try {
            const categoriesRes = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Product_category/fetch`);
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/fetchProductById`, { product_id })
            const Product = data.product
            setCategories(categoriesRes?.data?.category?.category || []);

            setProduct(Product)
            setIsLoading(false)

        } catch (error) {

        }
    }, [product_id])
    useEffect(() => {
        fetchProduct()
    }, [fetchProduct])


    if (isLoading) {
        return <PreLoader />
    }

    return (
        <div className="min-h-screen  py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center mb-6">
                            <button
                                onClick={goBack}
                                className="mr-2 text-gray-600 hover:text-gray-800"
                                aria-label="Go back"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                                <div className="flex items-center">
                                    <AlertCircle className="text-red-500 mr-2" size={20} />
                                    <p className="text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        {saveSuccess && (
                            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
                                <p className="text-green-700">Product updated successfully!</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={product.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={product.description}
                                    onChange={handleInputChange}
                                    // rows= 4
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter product description"
                                ></textarea>
                            </div>


                            <div className="mb-6">
                                <label htmlFor="Branch" className="block mb-2 text-sm font-medium text-gray-700">
                                    Branch
                                </label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        name="category"
                                        value={product.category}
                                        onChange={handleInputChange}
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value={''}>
                                            Select Category
                                        </option>

                                        {categories.map((category: any) => (
                                            <option key={category} selected={product?.category == category ? true : false} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="Branch" className="block mb-2 text-sm font-medium text-gray-700">
                                    Branch
                                </label>
                                <div className="relative">
                                    <select
                                        id="Branch"
                                        name="branchId"
                                        value={product?.branchId}
                                        onChange={handleInputChange}
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value={''}>
                                            Select Branch
                                        </option>

                                        {branches.map((branch: any) => (
                                            <option key={branch._id} selected={product?.branchId == branch._id ? true : false} value={branch._id}>
                                                {branch.branchName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>


                            <div className="mb-6">
                                <label htmlFor="rate" className="block mb-2 text-sm font-medium text-gray-700">
                                    Rate ({Company?.currency.symbol})
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">{Company?.currency.symbol}</span>
                                    <input
                                        type="number"
                                        id="rate"
                                        name="price"
                                        value={product.price}
                                        onChange={handleInputChange}
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="0.00"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className={`flex items-center px-6 py-2 text-white font-medium rounded-md ${isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} className="mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}