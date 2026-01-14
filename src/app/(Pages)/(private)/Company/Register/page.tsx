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
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';


const companySchema = z.object({
    companyName: z.string()
        .min(3, 'Company name must be at least 3 characters')
        .max(100, 'Company name must be less than 100 characters'),
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    zipCode: z.string()
        .min(4, 'ZIP code must be at least 4 characters')
        .max(10, 'ZIP code must be less than 10 characters'),
    industry: z.string().min(1, 'Industry is required'),
    companySize: z.string().min(1, 'Company size is required'),
    website: z.string()
        .url('Invalid website URL')
        .or(z.literal("")),
    description: z.string()
        .min(50, 'Description must be at least 50 characters')
        .max(2000, 'Description must be less than 1000 characters'),
    contactEmail: z.string()
        .email('Invalid email address')
        .min(1, 'Contact email is required'),
    countryCode: z.string()
        .regex(/^\+?[1-9]\d{0,4}$/, 'Invalid country code')
        .optional(),
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
    const router = useRouter()
    const { Company } = useSelector((state: any) => state.Company)
    const company = Company?.company
    if (company) {
        router.push('/Dashboard');
    }
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
            countryCode: '',
            contactPhone: '',
        },
    });

    const onSubmit = async (data: CompanyFormValues) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/Register`, data);
            if (res.data.success) {
                console.log(res.data);
                router.push('/Dashboard');
                toast.success('Company registered successfully!');
                reset();
                toast.success('Company registered successfully!');
            }
        } catch (error: any) {
            console.error('Error registering company:', error);
            toast.error(error.response?.data?.message || 'Failed to register company');
        }
    };

    return (
        <div className="">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 sm:p-10 border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                            Company Registration
                        </h2>
                        <p className="text-base text-gray-600 dark:text-gray-400">
                            Please fill in your company details to complete the registration process.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Company Information */}
                        <div className="space-y-5">
                            <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Company Information
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName" className="text-gray-700 dark:text-gray-300">
                                        Company Name <span className='text-red-600 dark:text-red-400 font-bold'>*</span>
                                    </Label>
                                    <Input
                                        id="companyName"
                                        {...register('companyName')}
                                        className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.companyName ? 'border-red-500 dark:border-red-500' : ''}`}
                                    />
                                    {errors.companyName && (
                                        <p className="text-sm text-red-500 dark:text-red-400">{errors.companyName.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="industry" className="text-gray-700 dark:text-gray-300">
                                        Industry <span className='text-red-600 dark:text-red-400 font-bold'>*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(value) => setValue('industry', value)}
                                    >
                                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            <SelectValue placeholder="Select Industry" />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                            {industries.map((industry) => (
                                                <SelectItem key={industry} value={industry} className="dark:text-white dark:focus:bg-gray-600">
                                                    {industry}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.industry && (
                                        <p className="text-sm text-red-500 dark:text-red-400">{errors.industry.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="companySize" className="text-gray-700 dark:text-gray-300">
                                        Company Size <span className='text-red-600 dark:text-red-400 font-bold'>*</span>
                                    </Label>
                                    <Select
                                        onValueChange={(value) => setValue('companySize', value)}
                                    >
                                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            <SelectValue placeholder="Select Company Size" />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                            {companySizes.map((size) => (
                                                <SelectItem key={size} value={size} className="dark:text-white dark:focus:bg-gray-600">
                                                    {size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.companySize && (
                                        <p className="text-sm text-red-500 dark:text-red-400">{errors.companySize.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website" className="text-gray-700 dark:text-gray-300">
                                        Website
                                    </Label>
                                    <Input
                                        id="website"
                                        required={false}
                                        placeholder="https://example.com"
                                        {...register('website')}
                                        className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.website ? 'border-red-500 dark:border-red-500' : ''}`}
                                    />
                                    {errors.website && (
                                        <p className="text-sm text-red-500 dark:text-red-400">{errors.website.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                                    Company Description <span className='text-red-600 dark:text-red-400 font-bold'>*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your company in detail..."
                                    {...register('description')}
                                    className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.description ? 'border-red-500 dark:border-red-500' : ''}`}
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500 dark:text-red-400">{errors.description.message}</p>
                                )}
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
                                <div className="space-y-2">
                                    <Label htmlFor="street" className="text-gray-700 dark:text-gray-300">
                                        Street <span className='text-red-600 dark:text-red-400 font-bold'>*</span>
                                    </Label>
                                    <Input
                                        id="street"
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
                                        placeholder="contact@company.com"
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
                                            {...register('countryCode')}
                                            className={`w-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.countryCode ? 'border-red-500 dark:border-red-500' : ''}`}
                                        />
                                        <Input
                                            id="contactPhone"
                                            type="tel"
                                            placeholder="1234567890"
                                            {...register('contactPhone')}
                                            className={`flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${errors.contactPhone ? 'border-red-500 dark:border-red-500' : ''}`}
                                        />
                                    </div>
                                    {(errors.contactPhone || errors.countryCode) && (
                                        <p className="text-sm text-red-500 dark:text-red-400">
                                            {errors.contactPhone?.message || errors.countryCode?.message}
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
                                {isSubmitting ? 'Registering...' : 'Register Company'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}