"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Plus, Search, Filter, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AddStaff from './Addstaff'
import axios from 'axios'
import moment from 'moment'

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
    const [showAddStaffModal, setShowAddStaffModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'staff' | 'admin' | 'manager' | 'Owner'>('all')
    const [loading, setLoading] = useState(true)
    // Dummy data
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
    const filteredStaff = staffMembers.filter(staff => {
        const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filterStatus === 'all' || staff.role === filterStatus
        return matchesSearch && matchesFilter
    })


    useEffect(() => {
        const fetchStaff = async () => {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/Staff/Fetch`)
            setStaffMembers(data.staff);
            setLoading(false)
        }
        fetchStaff()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Staff Management</h1>
                    <p className="text-gray-500 mt-1">Manage your team members and their roles</p>
                </div>
                <Button
                    onClick={() => setShowAddStaffModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white !rounded-lg whitespace-nowrap flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Staff Member
                </Button>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search staff..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'staff' | 'admin' | 'manager' | 'Owner')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="all">All</option>
                    <option value="Owner">Owner</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {/* Staff List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStaff.map((staff) => (
                    <div
                        key={staff._id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center space-x-4">
                            <img
                                src={staff.avatar}
                                alt={staff.name}
                                className="h-12 w-12 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {staff.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">{staff.role}</p>
                            </div>
                            <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${staff.role === 'staff'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {staff.role}
                            </span>
                        </div>
                        <div className="mt-4 space-y-1">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Email:</span> {staff.email}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Phone:</span> {staff.phone}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Joined:</span> {moment(staff.createdAt).format('MMM DD, YYYY')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Staff Modal */}
            <AnimatePresence>
                {showAddStaffModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black w-full bg-opacity-50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowAddStaffModal(false)}
                                className="absolute top-2 right-1 cursor-pointer rounded-full h-8 w-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <AddStaff setShowAddStaffModal={setShowAddStaffModal} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
