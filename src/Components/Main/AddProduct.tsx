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
            <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900">No Product Categories Found</h2>
                    <p className="text-gray-600">Please add product categories before creating products</p>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
                    <Link href="/Setting" className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Product Categories
                    </Link>
                </Button>
            </div>
        )
    }
    if (loading) {

        return <PreLoader />
    }



    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        required
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Price</label>
                        <Input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                            required
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>
                </div>
                {
                    User.branchId ? "" :
                        <div className="">


                            {
                                branches && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Branch</label>
                                        <select
                                            name="branchId"
                                            value={formData.branchId}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                                            required
                                        >
                                            <option value="">Select a Branch</option>
                                            {branches.map((branch: any, index: number) => (
                                                <option key={index} value={branch._id}>
                                                    {branch.branchName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )
                            }

                        </div>
                }


                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter product description"
                        className="min-h-[100px]"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? 'Adding Product...' : 'Add Product'}
                </Button>
            </form>
        </div>
    )
}
