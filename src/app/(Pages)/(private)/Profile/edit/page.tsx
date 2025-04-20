'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import WebLoader from '@/Components/Other/loader';

export default function ProfilePage() {
    const { User, loading } = useSelector((state: any) => state.User);
    const user = User
    const { Company, loading: companyLoading } = useSelector((state: any) => state.Company);
    const company = Company
    const [isLoading, setIsLoading] = useState(false);

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
    const initialFormData = useMemo(() => ({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: {
            street: user?.address?.street || '',
            city: user?.address?.city || '',
            state: user?.address?.state || '',
            zipCode: user?.address?.zipCode || '',
            country: user?.address?.country || '',
        },
    }), [user]);

    const initialCompanyData = useMemo(() => ({
        name: company?.name || '',
        email: company?.email || '',
        phone: company?.phone || '',
        address: {
            street: company?.address?.street || '',
            city: company?.address?.city || '',
            state: company?.address?.state || '',
            zipCode: company?.address?.zipCode || '',
            country: company?.address?.country || '',
        },
        website: company?.website || '',
        companySize: company?.companySize || '',
        industry: company?.industry || '',
        description: company?.description || '',
    }), [company]);

    useEffect(() => {

        setFormData(initialFormData);
        setCompanyData(initialCompanyData);
    }, [user, company, initialFormData, initialCompanyData]);


    const [formData, setFormData] = useState(initialFormData);
    const [companyData, setCompanyData] = useState(initialCompanyData);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name in formData) {
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({
                ...formData,
                address: { ...formData.address, [name]: value },
            });
        }
    };

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name in companyData) {
            setCompanyData({ ...companyData, [name]: value });
        } else {
            setCompanyData({
                ...companyData,
                address: { ...companyData.address, [name]: value },
            });
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/update`, formData);
            if (data.success) {
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateCompany = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/update`, companyData);
            if (data.success) {
                toast.success("Company updated successfully");
            }
        } catch (error) {
            toast.error("Failed to update company");
        } finally {
            setIsLoading(false);
        }
    };



    if (loading || companyLoading || isLoading) {
        return <WebLoader />
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 rounded-md">
            <div className="max-w-3xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                                <Image
                                    src={user?.profilePic || "/avatar.png"}
                                    alt="Profile Picture"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-6 px-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                                <p className="text-sm text-gray-500">{user?.role}</p>
                            </div>
                            <Button onClick={handleUpdateProfile}>
                                Save Profile Changes
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                                Contact Information
                            </h2>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Name</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <div className="mt-1">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <div className="mt-1">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                                Address
                            </h2>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Street</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.address.street}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">City</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.address.city}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">State</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.address.state}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Country</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.address.country}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">ZIP Code</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.address.zipCode}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    user?.role === "Owner" && !user?.companyId && (
                        <div className="mt-6 bg-white rounded-lg shadow-md p-6 space-y-6">
                            <Button>
                                <Link href="/Company/Register">
                                    Add Company
                                </Link>
                            </Button>
                        </div>
                    )
                }

                {
                    company && (
                        <div className="mt-6 bg-white rounded-lg shadow-md p-6 space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900">Company Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Company Name</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="name"
                                            value={companyData.name}
                                            onChange={handleCompanyChange}
                                            className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                        />
                                    </div>
                                </div>


                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mt-6">Contact Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <div className="mt-1">
                                        <input
                                            type="email"
                                            name="email"
                                            value={companyData.email}
                                            onChange={handleCompanyChange}
                                            className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <div className="mt-1">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={companyData.phone}
                                            onChange={handleCompanyChange}
                                            className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Street</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="street"
                                                value={companyData.address.street}
                                                onChange={handleCompanyChange}
                                                className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">City</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="city"
                                                value={companyData.address.city}
                                                onChange={handleCompanyChange}
                                                className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">State</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="state"
                                                value={companyData.address.state}
                                                onChange={handleCompanyChange}
                                                className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Country</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="country"
                                                value={companyData.address.country}
                                                onChange={handleCompanyChange}
                                                className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Zip Code</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={companyData.address.zipCode}
                                                onChange={handleCompanyChange}
                                                className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Website</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="website"
                                                value={companyData.website}
                                                onChange={handleCompanyChange}
                                                className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Company Size</label>
                                        <div className="mt-1">
                                            <select
                                                name="companySize"
                                                value={companyData.companySize}
                                                onChange={handleCompanyChange}
                                                className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                            >

                                                <option value="">Select Company Size</option>
                                                {companySizes.map((size, index) => (
                                                    <option key={index} value={size}>{size}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Industry</label>
                                        <div className="mt-1">
                                            <select
                                                name="industry"
                                                value={companyData.industry}
                                                onChange={handleCompanyChange}
                                                className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                            >
                                                <option value="">Select Industry</option>
                                                {industries.map((industry, index) => (
                                                    <option key={index} value={industry}>{industry}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-500">About</label>
                                        <div className="mt-1">
                                            <textarea
                                                name="description"
                                                value={companyData.description}
                                                onChange={handleCompanyChange}
                                                className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                user?.role === "Owner" && user?.companyId != null && (
                                    <div className="mt-6 bg-white rounded-lg p-6 space-y-6">
                                        <Button onClick={handleUpdateCompany}>
                                            Save Company Changes
                                        </Button>
                                    </div>
                                )
                            }

                        </div>
                    )
                }
            </div>
        </div>
    );
}
