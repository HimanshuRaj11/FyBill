'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit, Trash2, ArrowLeft, Building2, Shield, TrendingUp, Activity } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/Components/ui/card';
import { useSelector } from 'react-redux';
import DashboardTopCards from '@/Components/Other/DashboardTopCards';
import { motion } from 'framer-motion';
import "react-datepicker/dist/react-datepicker.css";
import InvoiceDateFilter from '@/Components/Other/InvoiceDateFilter';
import { useGlobalContext } from '@/context/contextProvider';
import InvoiceTableSkeleton from '@/Components/Skeleton/InvoiceTableSkeleton';
import InvoiceList from '@/Components/Main/InvoiceList';
import { Button } from '@/Components/ui/button';

export default function StaffDetailsCard({ params }: { params: Promise<{ StaffId: string }> }) {
    const { Company } = useSelector((state: any) => state.Company)
    const { User: currentUser } = useSelector((state: any) => state.User)
    const { dateRange, startDate, endDate } = useGlobalContext()
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false)
    const { StaffId } = React.use(params);
    const [staffMember, setStaffMember] = useState<any>({})


    const Address = staffMember?.address?.street + " " + staffMember?.address?.city + " " + staffMember?.address?.state

    const [Invoice, setInvoice] = useState([])

    const fetchStaffMember = useCallback(async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Staff/${StaffId}`, { withCredentials: true })
            if (data.success) {
                setStaffMember(data.Staff)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch staff member details')
            setIsLoading(false)
        }
    }, [StaffId])

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this staff member?')) return;

        try {
            setIsLoading(true)
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Staff/delete`, { _id: id }, { withCredentials: true })
            if (data.success) {
                toast.success(data.message)
                router.push('/Staff')
            }
            setIsLoading(false)
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to delete staff member')
            setIsLoading(false)
        }
    }

    const FetchInvoice = useCallback(async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Staff/${StaffId}/invoice`, { startDate, endDate })
            setInvoice(data.invoices)
            setIsLoading(false)
        } catch (error) {
            toast.error('Failed to fetch invoices')
            setIsLoading(false)
        }
    }, [StaffId, startDate, endDate])

    useEffect(() => {
        FetchInvoice()
    }, [FetchInvoice])

    useEffect(() => {
        fetchStaffMember()
    }, [fetchStaffMember])

    const getRoleBadge = (role: string) => {
        const badges = {
            Owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300 dark:border-purple-700',
            admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-300 dark:border-red-700',
            manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700',
            staff: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700'
        }
        return badges[role as keyof typeof badges] || badges.staff
    }

    if (isLoading && !staffMember?.name) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-400"></div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Loading staff details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Button
                        onClick={() => router.push('/Staff')}
                        variant="ghost"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Staff List
                    </Button>
                </motion.div>

                {/* Staff Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-gray-900/50 overflow-hidden mb-8">
                        {/* Header Background */}
                        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600 relative">
                            <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                        </div>

                        <CardContent className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row gap-6 -mt-20 relative">
                                {/* Profile Image */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex-shrink-0"
                                >
                                    <div className="relative">
                                        <div className="h-32 w-32 rounded-2xl bg-white dark:bg-gray-700 overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-xl">
                                            {staffMember?.imageUrl ? (
                                                <Image
                                                    width={128}
                                                    height={128}
                                                    src={staffMember?.imageUrl}
                                                    alt={`${staffMember?.name}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50">
                                                    <User size={64} className="text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                            )}
                                        </div>
                                        {/* Online Status Indicator */}
                                        <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full flex items-center justify-center shadow-lg">
                                            <Activity className="h-4 w-4 text-white" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Staff Info */}
                                <div className="flex-grow space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                                {staffMember?.name}
                                            </h1>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className={`px-4 py-1.5 text-sm font-semibold rounded-full border ${getRoleBadge(staffMember?.role)}`}>
                                                    <Shield className="inline h-3.5 w-3.5 mr-1.5" />
                                                    {staffMember?.role}
                                                </span>
                                                {staffMember?.position && (
                                                    <span className="px-4 py-1.5 text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full border border-indigo-300 dark:border-indigo-700">
                                                        <Briefcase className="inline h-3.5 w-3.5 mr-1.5" />
                                                        {staffMember?.position}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        {(currentUser?.role === "admin" || currentUser?.role === "Owner") && (
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => router.push(`/Staff/edit/${StaffId}`)}
                                                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </Button>
                                                {/* <Button
                                                    onClick={() => handleDelete(StaffId)}
                                                    variant="destructive"
                                                    className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </Button> */}
                                            </div>
                                        )}
                                    </div>

                                    {/* Contact Information Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                                        >
                                            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                                <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email Address</p>
                                                <p className="text-sm text-gray-900 dark:text-gray-100 truncate font-medium">{staffMember?.email}</p>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.35 }}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                                        >
                                            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                                <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Phone Number</p>
                                                <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">{staffMember?.phone}</p>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                                        >
                                            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                                                <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Location</p>
                                                <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">{Address || 'Not specified'}</p>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.45 }}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                                        >
                                            <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                                                <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Join Date</p>
                                                <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                                                    {moment(staffMember?.joinedAt).format('MMM DD, YYYY')}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Performance Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                Performance Overview
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {dateRange} invoice statistics and data
                            </p>
                        </div>
                        <InvoiceDateFilter />
                    </div>
                </motion.div>

                {/* Dashboard Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <DashboardTopCards Invoice={Invoice} loading={isLoading} />
                </motion.div>

                {/* Invoice List Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8"
                >
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            Invoice History
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Complete list of invoices for the selected period
                        </p>
                    </div>

                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all duration-300">
                        <CardContent className="p-6">
                            {isLoading ? (
                                <InvoiceTableSkeleton />
                            ) : (
                                <InvoiceList
                                    filteredInvoices={Invoice}
                                    searchQuery={''}
                                    Company={Company}
                                />
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}