"use client"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { toast } from 'react-toastify'
import { z } from 'zod'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PreLoader from '../Other/PreLoader'
import { Package, DollarSign, Tag, FileText, Building2, Plus } from 'lucide-react'

const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Price must be a positive number"
    }),
    description: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    branchId: z.string(),
})

type ProductFormData = z.infer<typeof productSchema>

const initialData: ProductFormData = {
    name: '',
    price: '',
    description: '',
    category: '',
    branchId: "",
}

export default function AddProduct() {
    const { Company } = useSelector((state: any) => state.Company);

    const branches = Company?.branch
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<string[]>([]);
    const [formData, setFormData] = useState<ProductFormData>(initialData)


    const [errors, setErrors] = useState<Partial<ProductFormData>>({})
    const { User } = useSelector((state: any) => state.User);
    const router = useRouter()
    useEffect(() => {
        setLoading(true)
        fetchCategories();
        setLoading(false)
    }, []);




    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        setErrors(prev => ({
            ...prev,
            [name]: undefined
        }))
    }

    const validateForm = () => {
        try {
            productSchema.parse(formData)
            setErrors({})
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors: Partial<ProductFormData> = {}
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        formattedErrors[err.path[0] as keyof ProductFormData] = err.message
                    }
                })
                setErrors(formattedErrors)
            }
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Please fix the form errors')
            return
        }

        setLoading(true)

        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/product/add`, formData)
            if (data.success) {
                toast.success('Product added successfully!')
                setFormData(initialData)
            } else {
                toast.error('Failed to add product')
            }
        } catch (error) {
            toast.error('Failed to add product')
            console.error('Error adding product:', error)
        } finally {
            setLoading(false)
        }
    }
    const fetchCategories = async () => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Product_category/fetch`);
        setCategories(response.data.category.category);
    };





    if (!loading && categories.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200 px-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="flex justify-center">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full">
                            <Package className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">No Product Categories Found</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Please add product categories before creating products</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                        <Link href="/Setting" className="flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Add Product Categories
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }
    if (loading) {

        return <PreLoader />
    }



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-8 px-4">
            <div className="w-full max-w-3xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Add New Product</h2>
                    <p className="text-gray-600 dark:text-gray-400">Fill in the details below to add a new product to your inventory</p>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Product Name */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                Product Name
                            </label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                                required
                            />
                            {errors.name && (
                                <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                                    <span className="text-lg">⚠</span> {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Price and Category Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Price */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    Price
                                </label>
                                <Input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                                    required
                                />
                                {errors.price && (
                                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                                        <span className="text-lg">⚠</span> {errors.price}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="" className="dark:bg-gray-700">Select a category</option>
                                        {categories.map((category, index) => (
                                            <option key={index} value={category} className="dark:bg-gray-700">
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.category && (
                                    <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                                        <span className="text-lg">⚠</span> {errors.category}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Branch Selection */}
                        {!User.branchId && branches && (
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    <Building2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    Branch
                                </label>
                                <div className="relative">
                                    <select
                                        name="branchId"
                                        value={formData.branchId}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="" className="dark:bg-gray-700">Select a Branch</option>
                                        {branches.map((branch: any, index: number) => (
                                            <option key={index} value={branch._id} className="dark:bg-gray-700">
                                                {branch.branchName}
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
                        )}

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                Description
                                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
                            </label>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter product description..."
                                className="min-h-[120px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none transition-all duration-200"
                            />
                            {errors.description && (
                                <p className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
                                    <span className="text-lg">⚠</span> {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding Product...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Plus className="w-5 h-5" />
                                        Add Product
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Helper text */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    All fields marked with an asterisk are required
                </p>
            </div>
        </div>
    )
}