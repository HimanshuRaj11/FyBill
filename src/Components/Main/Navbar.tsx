'use client'
import { Bell, ChevronDown, LogOut, Search, User as UserIcon, Settings, CreditCard, UserCircle, Building2, Crown, Sparkles, Menu, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import Link from 'next/link'
import axios from 'axios'
import { FetchUser, LogoutUser } from '@/app/Redux/Slice/User.slice'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { FetchCompany } from '@/app/Redux/Slice/Company.slice'
import { FetchProductsList } from '@/app/Redux/Slice/Products.slice'
import { FetchInvoicesList } from '@/app/Redux/Slice/Invoice.slice'
import { useGlobalContext } from '@/context/contextProvider'

const base_url = process.env.NEXT_PUBLIC_BASE_URL

export default function Navbar() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { User } = useSelector((state: any) => state.User);
    const user = User

    const { Company } = useSelector((state: any) => state.Company);
    const company = Company

    const {
        selectedBranch,
        setSelectedBranch,
        dateRange,
        startDate,
        endDate,
    } = useGlobalContext();

    const [isLoading, setIsLoading] = useState(false)
    const [notifications, setNotifications] = useState(0)

    const ConnectDb = async () => {
        try {
            await axios.get(`${base_url}/api/v1/db`)
        } catch (error) {
            return error
        }
    }

    const Logout = () => {
        setIsLoading(true)
        setTimeout(() => {
            router.push('/')
            dispatch(LogoutUser() as any);
            setIsLoading(false)
        }, 500)
    }

    useEffect(() => {
        ConnectDb();
        if (user && company) {
            dispatch(FetchProductsList() as any);
            dispatch(FetchInvoicesList({ selectedBranch, startDate, endDate }) as any)
            return
        }

        dispatch(FetchUser() as any);
        dispatch(FetchCompany() as any);

        dispatch(FetchProductsList() as any);
        dispatch(FetchInvoicesList({ selectedBranch, startDate, endDate }) as any)

    }, [dispatch])

    return (
        <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 z-50 top-0 w-full fixed">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo Section */}
                    <Link href={'/'} className="flex-shrink-0">
                        <div className="flex items-center space-x-2 group">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl group-hover:shadow-lg transition-all duration-300">
                                <CreditCard className="h-6 w-6 text-white" />
                            </div>
                            <div className="logo font-bold text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                FyBill
                            </div>
                        </div>
                    </Link>

                    {/* Company Section - Center */}
                    {company && (
                        <div className="hidden md:flex flex-1 justify-center">
                            <Link href={'/Dashboard'} className="group">
                                <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 border border-gray-200 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md">
                                    <Building2 className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                    <span className="font-semibold text-gray-800 group-hover:text-blue-800 transition-colors text-lg">
                                        {company?.name}
                                    </span>
                                    {User?.role === "Owner" && (
                                        <Crown className="h-4 w-4 text-yellow-500" />
                                    )}
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">

                        {!User ? (
                            <div className="flex items-center space-x-3">
                                <Button variant="ghost" className="hidden sm:flex">
                                    <Link href={'/Login'} className="flex items-center space-x-2">
                                        <UserIcon className="h-4 w-4" />
                                        <span>Sign In</span>
                                    </Link>
                                </Button>

                            </div>
                        ) : (
                            <>


                                {/* Notifications */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hidden sm:flex h-9 w-9 p-0 hover:bg-gray-100 rounded-full relative"
                                >
                                    <Bell className="h-4 w-4 text-gray-600" />
                                    {notifications > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                            {notifications}
                                        </span>
                                    )}
                                </Button>

                                {/* Mobile Company Name */}
                                {company && (
                                    <div className="md:hidden">
                                        <Link href={'/Dashboard'}>
                                            <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                                <Building2 className="h-4 w-4 text-gray-600" />
                                                <span className="font-medium text-gray-800 text-sm truncate max-w-[100px]">
                                                    {company?.name}
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                )}

                                {/* User Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex items-center cursor-pointer  p-1 rounded-full transition-all duration-200">
                                            <div className="relative">
                                                <div className="rounded-full size-10 text-center bg-gray-200 ring shadow flex items-center justify-center font-bold text-2xl ">
                                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                            </div>
                                        </div>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-72 p-1 rounded-2xl shadow-2xl border border-gray-100 bg-white backdrop-blur-md mt-2">
                                        {/* User Info Section */}
                                        <Link href={'/Profile'}>
                                            <div className="flex items-center p-4 mb-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border border-transparent hover:border-blue-100 group">
                                                <div className="relative">
                                                    <div className="rounded-full size-10 text-center bg-gray-200 ring shadow flex items-center justify-center font-bold text-2xl ">
                                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </div>
                                                </div>
                                                <div className="flex-1 ml-2">
                                                    <div className="flex items-center space-x-2">
                                                        <p className="font-semibold text-gray-800 group-hover:text-blue-800 transition-colors">
                                                            {user?.name || 'User'}
                                                        </p>
                                                        {User?.role === "Owner" && (
                                                            <Crown className="h-4 w-4 text-yellow-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                                                        {user?.email || 'user@example.com'}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1 px-2 py-1 bg-gray-100 rounded-full inline-block">
                                                        {User?.role || 'User'}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>

                                        <DropdownMenuSeparator className="my-2 bg-gray-200" />

                                        {/* Settings for Owner */}
                                        {User?.role === "Owner" && (
                                            <>
                                                <Link href={'/Setting'}>
                                                    <DropdownMenuItem className="cursor-pointer p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 flex items-center group border border-transparent hover:border-indigo-100">
                                                        <div className="p-2 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition-colors mr-3">
                                                            <Settings className="h-4 w-4 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-800 group-hover:text-indigo-800">Settings</span>
                                                            <p className="text-xs text-gray-500">Manage your account</p>
                                                        </div>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator className="my-2 bg-gray-200" />
                                            </>
                                        )}

                                        {/* Logout */}
                                        <DropdownMenuItem
                                            onClick={Logout}
                                            className="cursor-pointer p-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 flex items-center group border border-transparent hover:border-red-100"
                                            disabled={isLoading}
                                        >
                                            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors mr-3">
                                                {isLoading ? (
                                                    <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <LogOut className="h-4 w-4 text-red-600" />
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-medium text-red-600 group-hover:text-red-700">
                                                    {isLoading ? 'Signing out...' : 'Sign Out'}
                                                </span>
                                                <p className="text-xs text-red-400">Come back soon!</p>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}
                    </div>
                </div>


            </div>
        </header>
    )
}