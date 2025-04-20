'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel, AlertDialogAction } from '@/Components/ui/alert-dialog';
import axios from 'axios';
import { toast } from 'react-toastify';
export default function ProfilePage() {
    const { User } = useSelector((state: any) => state.User);
    const user = User
    const { Company } = useSelector((state: any) => state.Company)
    const company = Company
    const [branches, setBranches] = useState([])


    const handleDeleteCompany = async () => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/delete`)
            if (response.status === 200) {
                toast.success("Company deleted successfully")
            }
        } catch (error) {
            toast.error("Failed to delete company")
        }
    }
    useEffect(() => {
        const fetchBranches = async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/company/branch/fetch`)
            if (response.data.success) {
                setBranches(response.data.branches)
            }
        }
        fetchBranches()
    }, [])
    return (
        <div className=" min-h-screen ">
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
                            <Button>
                                <Link href="/Profile/edit">
                                    Edit Profile
                                </Link>
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
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <div className="mt-1">
                                        <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <div className="mt-1">
                                        <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                            {user?.phone}
                                        </p>
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
                                        <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                            {user?.address?.street}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">City</label>
                                        <div className="mt-1">
                                            <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                                {user?.address?.city}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">State</label>
                                        <div className="mt-1">
                                            <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                                {user?.address?.state}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">ZIP Code</label>
                                    <div className="mt-1">
                                        <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                            {user?.address?.zipCode}
                                        </p>
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
                                        <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                            {company?.name}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Currency</label>
                                    <div className="mt-1">
                                        <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                            {`${company?.currency.name} (${company?.currency.symbol})`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mt-6">Contact Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <div className="mt-1">
                                        <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                            {company?.email}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <div className="mt-1">
                                        <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                            {company?.phone}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Website</label>
                                    <div className="mt-1">
                                        <a
                                            href={company?.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200 hover:text-blue-600 transition-colors block"
                                        >
                                            {company?.website}
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Company Size</label>
                                    <div className="mt-1">
                                        <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                            {company?.companySize}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Industry</label>
                                    <div className="mt-1">
                                        <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                            {company?.industry}
                                        </p>
                                    </div>
                                </div>
                                <div>

                                </div>
                                <div className="">
                                    <h1 className='text-md font-medium text-gray-900'>Company Address:</h1>
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Street</label>
                                        <div className="mt-1">
                                            <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                                {company?.address?.street}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">City</label>
                                        <div className="mt-1">
                                            <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                                {company?.address?.city}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">State</label>
                                        <div className="mt-1">
                                            <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                                {company?.address?.state}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Country</label>
                                        <div className="mt-1">
                                            <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                                {company?.address?.country}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Zip Code</label>
                                        <div className="mt-1">
                                            <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                                {company?.address?.zipCode}
                                            </p>
                                        </div>
                                    </div>



                                </div>

                            </div>
                            {
                                branches?.length > 0 && (
                                    <div className="mt-6">
                                        <h1 className='text-xl font-semibold text-gray-900'>Branch Details</h1>
                                        {
                                            branches.map((branch: any) => (
                                                <div className="mt-4 border rounded-lg p-4" key={branch._id}>
                                                    <h1 className='text-md font-medium text-gray-900'>Branch Name:
                                                        <span className='text-sm ml-2 font-medium text-gray-500'>{branch?.branchName}</span>
                                                    </h1>
                                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="text-sm font-medium text-gray-500">Street</label>
                                                            <div className="mt-1">
                                                                <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                                                    {branch?.address?.street}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-sm font-medium text-gray-500">City</label>
                                                            <div className="mt-1">
                                                                <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                                                    {branch?.address?.city}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-sm font-medium text-gray-500">State</label>
                                                            <div className="mt-1">
                                                                <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                                                    {branch?.address?.state}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-sm font-medium text-gray-500">Country</label>
                                                            <div className="mt-1">
                                                                <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                                                    {branch?.address?.country}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-sm font-medium text-gray-500">Zip Code</label>
                                                            <div className="mt-1">
                                                                <p className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200">
                                                                    {branch?.address?.zipCode}
                                                                </p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            <div className="mt-6 flex w-full ">
                                <Button>
                                    <Link href="/Company/Branch/Register">
                                        Add Branch
                                    </Link>
                                </Button>
                            </div>

                            <div className="col-span-2">
                                <label className="text-sm font-medium text-gray-500">About</label>
                                <div className="mt-1">
                                    <p className="text-sm text-gray-500">{company?.description}</p>
                                </div>
                            </div>


                            {
                                user?.role === "Owner" && user?.companyId && (
                                    <div className="mt-6 bg-white rounded-lg  p-6 space-y-6">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" className='w-full cursor-pointer'>
                                                    Delete Company
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your company
                                                        and remove all associated data.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteCompany()} className="bg-destructive cursor-pointer text-destructive-foreground hover:bg-destructive/90">
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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
