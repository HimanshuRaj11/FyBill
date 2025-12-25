"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Plus, Search, Filter, X, Mail, Phone, Calendar, User, Trash2, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AddStaff from './Addstaff'
import axios from 'axios'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Image from 'next/image'
import Link from 'next/link'

interface StaffMember {
    _id: string
    name: string
    role: string
    email: string
    phone: string
    createdAt: string
    avatar: string
}

export default function Staff() {
    const { User } = useSelector((state: any) => state.User);
    const user = User

    const [showAddStaffModal, setShowAddStaffModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'staff' | 'admin' | 'manager' | 'Owner'>('all')
    const [loading, setLoading] = useState(true)
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])

    const fetchStaff = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Staff/Fetch`)
            setStaffMembers(data.staff);
            setLoading(false)
        } catch (error) {
            toast.error('Failed to fetch staff members')
            setLoading(false)
        }
    }

    const filteredStaff = staffMembers?.filter(staff => {
        const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filterStatus === 'all' || staff.role === filterStatus
        return matchesSearch && matchesFilter
    })

    const handleDelete = async (id: string) => {
        try {
            setLoading(true)
            // const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Staff/delete`, { _id: id }, { withCredentials: true })
            // if (data.success) {
            //     toast.success(data.message)
            //     fetchStaff()
            // }
            setLoading(false)
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to delete staff member')
            setLoading(false)
        }
    }

    const getRoleBadgeStyles = (role: string) => {
        const styles = {
            Owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
            admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
            manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
            staff: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800'
        }
        return styles[role as keyof typeof styles] || styles.staff
    }

    useEffect(() => {
        fetchStaff()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-400"></div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Loading staff members...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Staff Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">
                            Manage your team members and their roles
                        </p>
                    </div>
                    {(user?.role === "admin" || user?.role === "Owner") && (
                        <Button
                            onClick={() => setShowAddStaffModal(true)}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap flex items-center gap-2 px-6 py-3"
                        >
                            <Plus className="h-5 w-5" />
                            Add Staff Member
                        </Button>
                    )}
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-4 md:p-6 mb-6 border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-4 py-3 w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>
                        <div className="relative sm:w-48">
                            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'staff' | 'admin' | 'manager' | 'Owner')}
                                className="pl-12 pr-4 py-3 w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent appearance-none cursor-pointer transition-all text-gray-900 dark:text-gray-100"
                            >
                                <option value="all">All Roles</option>
                                <option value="Owner">Owner</option>
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing <span className="font-semibold text-indigo-600 dark:text-indigo-400">{filteredStaff.length}</span> of <span className="font-semibold">{staffMembers.length}</span> staff members
                        </p>
                    </div>
                </motion.div>

                {/* Staff Grid */}
                {filteredStaff.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-12 text-center border border-gray-200 dark:border-gray-700"
                    >
                        <User className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No staff members found</h3>
                        <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStaff.map((staff, index) => (
                            <motion.div
                                key={staff._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all duration-300 overflow-hidden group"
                            >
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 p-6 relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="relative flex items-center space-x-4">
                                        <div className="relative">
                                            <Image
                                                src={staff?.avatar || '/avatar.png'}
                                                alt={staff.name}
                                                className="h-16 w-16 rounded-full border-4 border-white dark:border-gray-700 shadow-lg object-cover"
                                                width={64}
                                                height={64}
                                            />
                                            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-white truncate">
                                                {staff.name}
                                            </h3>
                                            <span className={`mt-1 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleBadgeStyles(staff.role)}`}>
                                                {staff.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 text-sm">
                                            <div className="flex-shrink-0">
                                                <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <span className="text-gray-600 dark:text-gray-400 truncate">{staff.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <div className="flex-shrink-0">
                                                <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <span className="text-gray-600 dark:text-gray-400">{staff.phone}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <div className="flex-shrink-0">
                                                <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Joined {moment(staff.createdAt).format('MMM DD, YYYY')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {(user?.role === "admin" || user?.role === "Owner") && (
                                        <div className="pt-4 flex gap-2 border-t border-gray-200 dark:border-gray-700">
                                            <Link href={`Staff/${staff._id}`} className="flex-1">
                                                <Button
                                                    size="sm"
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-all"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View
                                                </Button>
                                            </Link>
                                            {/* <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(staff._id)}
                                                className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button> */}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Staff Modal */}
            <AnimatePresence>
                {showAddStaffModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAddStaffModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-200 dark:border-gray-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowAddStaffModal(false)}
                                className="absolute top-4 right-4 cursor-pointer rounded-full h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                            >
                                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </Button>
                            <AddStaff setShowAddStaffModal={setShowAddStaffModal} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}