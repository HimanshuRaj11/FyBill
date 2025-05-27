'use client'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { IBranch } from '@/Model/branch.model'
import { Loader2, MapPin, Phone, Mail, Building2 } from 'lucide-react'

// Validation schema
const branchSchema = z.object({
    branchName: z.string().min(1, 'Branch name is required').min(2, 'Branch name must be at least 2 characters'),
    street: z.string().min(1, 'City is required').min(2, 'City must be at least 2 characters'),
    city: z.string().min(1, 'City is required').min(2, 'City must be at least 2 characters'),
    state: z.string().min(1, 'State is required').min(2, 'State must be at least 2 characters'),
    zipCode: z.string().min(1, 'ZIP code is required').regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
    phone: z.string().min(1, 'Phone number is required').regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format'),
    countryCode: z.string().min(1, 'country Code number is required').regex(/^\+\d{1,4}$/, 'Invalid Country Code'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
})

type BranchFormData = z.infer<typeof branchSchema>

export default function EditBranchPage({ params }: { params: Promise<{ branchId: string }> }) {
    const { branchId } = React.use(params)
    const [branchData, setBranchData] = useState<IBranch>()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    console.log(branchData);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<BranchFormData>({
        resolver: zodResolver(branchSchema),
        defaultValues: {
            branchName: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            phone: '',
            countryCode: '',
            email: '',
        }
    })

    const onSubmit = async (data: BranchFormData) => {
        setIsSubmitting(true)
        try {
            const updateData = {
                ...branchData,
                ...data,
                id: branchId
            }

            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/branch/update`,
                updateData,
                { withCredentials: true }
            )

            if (res.data.success) {
                toast.success('Branch updated successfully!')
                router.push('/Profile')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update branch')
        } finally {
            setIsSubmitting(false)
        }
    }

    const fetchBranch = useCallback(async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/branch/${branchId}`,
                { withCredentials: true }
            )

            if (data.success) {
                setBranchData(data.Branch)
                const branch = data.Branch
                reset({
                    branchName: branch.branchName || '',
                    street: branch.address.street || '',
                    city: branch.address.city || '',
                    state: branch.address.state || '',
                    zipCode: branch.address.zipCode || '',
                    phone: branch.phone || '',
                    countryCode: branch.CountryCode || '',
                    email: branch.email || '',
                })
            }
        } catch (error: any) {
            toast.error('Failed to fetch branch data')
            console.error('Error fetching branch:', error)
        } finally {
            setIsLoading(false)
        }
    }, [branchId, reset])

    useEffect(() => {
        fetchBranch()
    }, [fetchBranch])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="text-lg">Loading branch data...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Building2 className="h-8 w-8" />
                        Edit Branch
                    </h1>
                    <p className="mt-2 text-gray-600">Update your branch information below</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Branch Information</CardTitle>
                        <CardDescription>
                            Modify the details for your branch location
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Branch Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Branch Name
                                </Label>
                                <Input
                                    id="name"
                                    {...register('branchName')}
                                    placeholder="Enter branch name"
                                    className={errors.branchName ? 'border-red-500' : ''}
                                />
                                {errors.branchName && (
                                    <p className="text-sm text-red-600">{errors.branchName.message}</p>
                                )}
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <Label htmlFor="address" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Street Address
                                </Label>
                                <Input
                                    id="address"
                                    {...register('street')}
                                    placeholder="Enter street address"
                                    className={errors.street ? 'border-red-500' : ''}
                                />
                                {errors.street && (
                                    <p className="text-sm text-red-600">{errors.street.message}</p>
                                )}
                            </div>

                            {/* City, State, ZIP */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        {...register('city')}
                                        placeholder="City"
                                        className={errors.city ? 'border-red-500' : ''}
                                    />
                                    {errors.city && (
                                        <p className="text-sm text-red-600">{errors.city.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        {...register('state')}
                                        placeholder="State"
                                        className={errors.state ? 'border-red-500' : ''}
                                    />
                                    {errors.state && (
                                        <p className="text-sm text-red-600">{errors.state.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="zipCode">ZIP Code</Label>
                                    <Input
                                        id="zipCode"
                                        {...register('zipCode')}
                                        placeholder="12345"
                                        className={errors.zipCode ? 'border-red-500' : ''}
                                    />
                                    {errors.zipCode && (
                                        <p className="text-sm text-red-600">{errors.zipCode.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2 ">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Phone Number
                                </Label>
                                <div className="flex flex-row gap-1">

                                    <Input
                                        id="countryCode"
                                        {...register('countryCode')}
                                        placeholder="+555"
                                        className={'w-fit' + errors.countryCode ? 'border-red-500' : ''}
                                    />
                                    <Input
                                        id="phone"
                                        {...register('phone')}
                                        placeholder="123-4567"
                                        className={errors.phone ? 'border-red-500' : ''}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    placeholder="branch@company.com"
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>


                            {/* Action Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="flex-1"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating Branch...
                                        </>
                                    ) : (
                                        'Update Branch'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}