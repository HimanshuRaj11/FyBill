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
import { Textarea } from '@/Components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select'

const companySchema = z.object({
    companyName: z.string()
        .min(3, 'Company name must be at least 3 characters')
        .max(100, 'Company name must be less than 100 characters'),
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    zipCode: z.string()
        .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
    industry: z.string().min(1, 'Industry is required'),
    companySize: z.string().min(1, 'Company size is required'),
    website: z.string()
        .url('Invalid website URL')
        .min(1, 'Website is required'),
    description: z.string()
        .min(50, 'Description must be at least 50 characters')
        .max(1000, 'Description must be less than 1000 characters'),
    contactEmail: z.string()
        .email('Invalid email address')
        .min(1, 'Contact email is required'),
    contactPhone: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        .min(1, 'Contact phone is required'),
});

type CompanyFormValues = z.infer<typeof companySchema>;

const companySizes = [
    'select company size',
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees',
];

const industries = [
    'select industry',
    'Technology',
    'Finance',
    'Food & Beverage',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Retail',
    'Other',
];

export default function CompanyRegistration() {


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset,
    } = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            companyName: '',
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
            industry: '',
            companySize: '',
            website: '',
            description: '',
            contactEmail: '',
            contactPhone: '',
        },
    });

    const onSubmit = async (data: CompanyFormValues) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Register`, data);
            toast.success('Company registered successfully!');
            reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to register company');
        }
    };

    return (
        <div className=" min-h-screen">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Company Registration</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please fill in your company details to complete the registration process.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Company Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName">Company Name</Label>
                                    <Input
                                        id="companyName"
                                        {...register('companyName')}
                                        className={errors.companyName ? 'border-red-500' : ''}
                                    />
                                    {errors.companyName && (
                                        <p className="text-sm text-red-500">{errors.companyName.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Select
                                        onValueChange={(value) => setValue('industry', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {industries.map((industry) => (
                                                <SelectItem key={industry} value={industry}>
                                                    {industry}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.industry && (
                                        <p className="text-sm text-red-500">{errors.industry.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="companySize">Company Size</Label>
                                    <Select
                                        onValueChange={(value) => setValue('companySize', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Company Size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companySizes.map((size) => (
                                                <SelectItem key={size} value={size}>
                                                    {size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.companySize && (
                                        <p className="text-sm text-red-500">{errors.companySize.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        {...register('website')}
                                        className={errors.website ? 'border-red-500' : ''}
                                    />
                                    {errors.website && (
                                        <p className="text-sm text-red-500">{errors.website.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Company Description</Label>
                                <Textarea
                                    id="description"
                                    {...register('description')}
                                    className={errors.description ? 'border-red-500' : ''}
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">{errors.description.message}</p>
                                )}
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
                                    <Input
                                        id="contactPhone"
                                        type="tel"
                                        {...register('contactPhone')}
                                        className={errors.contactPhone ? 'border-red-500' : ''}
                                    />
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
                                {isSubmitting ? 'Registering...' : 'Register Company'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 