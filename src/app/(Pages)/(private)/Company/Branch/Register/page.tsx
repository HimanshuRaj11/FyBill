'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useRouter } from 'next/navigation';


const companySchema = z.object({
    branchName: z.string()
        .min(3, 'Branch name must be at least 3 characters')
        .max(100, 'Branch name must be less than 100 characters'),
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    zipCode: z.string()
        .min(4, 'ZIP code must be at least 4 characters')
        .max(10, 'ZIP code must be less than 10 characters'),
    contactEmail: z.string()
        .email('Invalid email address')
        .min(1, 'Contact email is required'),
    CountryCode: z.string()
        .regex(/^\+?[1-9]\d{0,4}$/, 'Invalid country code')
        .optional(),
    contactPhone: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        .min(1, 'Contact phone is required'),
});

type CompanyFormValues = z.infer<typeof companySchema>;


export default function CompanyRegistration() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            branchName: '',
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
            contactEmail: '',
            CountryCode: '',
            contactPhone: '',
        },
    });

    const onSubmit = async (data: CompanyFormValues) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/branch/register`, data);
            if (res.data.success) {
                router.push('/Dashboard');
                toast.success('Branch registered successfully!');
                reset();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to register branch');
        }
    };

    return (
        <div className=" min-h-screen">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Branch Registration</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please fill in your branch details to complete the registration process.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Company Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Branch Information</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="branchName">Branch Name</Label>
                                    <Input
                                        id="branchName"
                                        {...register('branchName')}
                                        className={errors.branchName ? 'border-red-500' : ''}
                                    />
                                    {errors.branchName && (
                                        <p className="text-sm text-red-500">{errors.branchName.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="street">Street Address</Label>
                                    <Input
                                        id="street"
                                        {...register('street')}
                                        className={errors.street ? 'border-red-500' : ''}
                                    />
                                    {errors.street && (
                                        <p className="text-sm text-red-500">{errors.street.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        {...register('city')}
                                        className={errors.city ? 'border-red-500' : ''}
                                    />
                                    {errors.city && (
                                        <p className="text-sm text-red-500">{errors.city.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        {...register('state')}
                                        className={errors.state ? 'border-red-500' : ''}
                                    />
                                    {errors.state && (
                                        <p className="text-sm text-red-500">{errors.state.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        {...register('country')}
                                        className={errors.country ? 'border-red-500' : ''}
                                    />
                                    {errors.country && (
                                        <p className="text-sm text-red-500">{errors.country.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="zipCode">ZIP Code</Label>
                                    <Input
                                        id="zipCode"
                                        {...register('zipCode')}
                                        className={errors.zipCode ? 'border-red-500' : ''}
                                    />
                                    {errors.zipCode && (
                                        <p className="text-sm text-red-500">{errors.zipCode.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail">Contact Email</Label>
                                    <Input
                                        id="contactEmail"
                                        type="email"
                                        {...register('contactEmail')}
                                        className={errors.contactEmail ? 'border-red-500' : ''}
                                    />
                                    {errors.contactEmail && (
                                        <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactPhone">Contact Phone</Label>
                                    <div className="flex items-center justify-between gap-2">

                                        <Input
                                            id="CountryCode"
                                            type="text"
                                            placeholder="+1"
                                            {...register('CountryCode')}
                                            className={` w-18 ${errors.CountryCode ? 'border-red-500' : ''}`}
                                        />
                                        <Input
                                            id="contactPhone"
                                            type="tel"
                                            {...register('contactPhone')}
                                            className={errors.contactPhone ? 'border-red-500' : ''}
                                        />
                                    </div>
                                    {errors.contactPhone && (
                                        <p className="text-sm text-red-500">{errors.contactPhone.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {isSubmitting ? 'Registering...' : 'Register Branch'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 