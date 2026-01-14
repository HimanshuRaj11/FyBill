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
        <div>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 sm:p-10 border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Branch Registration
                        </h2>
                        <p className="text-base text-gray-600 dark:text-gray-400">
                            Please fill in your branch details to complete the registration process.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Branch Information */}
                        <div className="space-y-5">
                            <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Branch Information
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="branchName" className="text-gray-700 dark:text-gray-300">
                                        Branch Name <span className='text-red-600 dark:text-red-400 font-bold'>*</span>
                                    </Label>
                                    <Input
                                        id="branchName"
                                        placeholder="e.g., Downtown Branch, North Office"
                                        {...register('branchName')}
                                        className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.branchName ? 'border-red-500 dark:border-red-500' : ''}`}
                                    />
                                    {errors.branchName && (
                                        <p className="text-sm text-red-500 dark:text-red-400">{errors.branchName.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="space-y-5">
                            <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Address Information
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="street" className="text-gray-700 dark:text-gray-300">
                                        Street Address <span className='text-red-600 dark:text-red-400 font-bold'>*</span>
                                    </Label>
                                    <Input
                                        id="street"
                                        placeholder="123 Main Street"
                                        {...register('street')}
                                        className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.street ? 'border-red-500 dark:border-red-500' : ''}`}
                                    />
                                    {errors.street && (
                                        <p className="text-sm text-red-500 dark:text-red-400">{errors.street.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-gray-700 dark:text-gray-300">
                                        City <span className='text-red-600 dark:text-red-400 font-bold'>*</span>
                                    </Label>
                                    <Input
                                        id="city"
                                        placeholder="New York"
                                        {...register('city')}
                                        className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.city ? 'border-red-500 dark:border-red-500' : ''}`}
                                    />
                                    {errors.city && (
                                        <p className="text-sm text-red-500 dark:text-red-400">{errors.city.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state" className="text-gray-700 dark:text-gray-300">
                                        State <span className='text-red-600 dark:text-red-400 font-bold'>*</span>
                                    </Label>
                                    <Input
                                        id="state"
                                        placeholder="New York"
                                        {...register('state')}
                                        className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.state ? 'border-red-500 dark:border-red-500' : ''}`}
                                    />
                                    {errors.state && (
                                        <p className="text-sm text-red-500 dark:text-red-400">{errors.state.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">
                                        Country <span className='text-red-600 dark:text-red-400 font-bold'>*</span>
                                    </Label>
                                    <Input
                                        id="country"
                                        placeholder="United States"
                                        {...register('country')}
                                        className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.country ? 'border-red-500 dark:border-red-500' : ''}`}
                                    />
                                    {errors.country && (
                                        <p className="text-sm text-red-500 dark:text-red-400">{errors.country.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="zipCode" className="text-gray-700 dark:text-gray-300">
                                        ZIP Code <span className='text-red-600 dark:text-red-400 font-bold'>*</span>
                                    </Label>
                                    <Input
                                        id="zipCode"
                                        placeholder="10001"
                                        {...register('zipCode')}
                                        className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.zipCode ? 'border-red-500 dark:border-red-500' : ''}`}
                                    />
                                    {errors.zipCode && (
                                        <p className="text-sm text-red-500 dark:text-red-400">{errors.zipCode.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-5">
                            <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Contact Information
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail" className="text-gray-700 dark:text-gray-300">
                                        Contact Email <span className='text-red-600 dark:text-red-400 font-bold'>*</span>
                                    </Label>
                                    <Input
                                        id="contactEmail"
                                        type="email"
                                        placeholder="branch@company.com"
                                        {...register('contactEmail')}
                                        className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.contactEmail ? 'border-red-500 dark:border-red-500' : ''}`}
                                    />
                                    {errors.contactEmail && (
                                        <p className="text-sm text-red-500 dark:text-red-400">{errors.contactEmail.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactPhone" className="text-gray-700 dark:text-gray-300">
                                        Contact Phone <span className='text-red-600 dark:text-red-400 font-bold'>*</span>
                                    </Label>
                                    <div className="flex items-start gap-2">
                                        <Input
                                            id="CountryCode"
                                            type="text"
                                            placeholder="+1"
                                            {...register('CountryCode')}
                                            className={`w-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.CountryCode ? 'border-red-500 dark:border-red-500' : ''}`}
                                        />
                                        <Input
                                            id="contactPhone"
                                            type="tel"
                                            placeholder="1234567890"
                                            {...register('contactPhone')}
                                            className={`flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.contactPhone ? 'border-red-500 dark:border-red-500' : ''}`}
                                        />
                                    </div>
                                    {(errors.contactPhone || errors.CountryCode) && (
                                        <p className="text-sm text-red-500 dark:text-red-400">
                                            {errors.contactPhone?.message || errors.CountryCode?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-2.5 text-base font-medium transition-colors duration-200"
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