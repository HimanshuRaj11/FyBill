'use client'
import { Bell, ChevronDown, LogOut, Search, User, Settings, CreditCard, UserCircle } from 'lucide-react'
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
const base_url = process.env.NEXT_PUBLIC_BASE_URL


export default function Navbar() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { User } = useSelector((state: any) => state.User);
    const user = User

    const { Company } = useSelector((state: any) => state.Company);
    const company = Company

    const ConnectDb = async () => {
        try {
            await axios.get(`${base_url}/api/v1/db`)
        } catch (error) {
            return error
        }
    }

    const Logout = () => {
        router.push('/')
        dispatch(LogoutUser() as any);
    }
    useEffect(() => {
        ConnectDb();
        dispatch(FetchUser() as any);
        dispatch(FetchCompany() as any);
    }, [dispatch])
    return (

        <header className="bg-white shadow-sm z-50 top-0 w-full fixed ">
            <div className="flex items-center justify-between p-4">
                <Link href={'/'}>
                    <div className="logo font-bold text-4xl text-blue-700">
                        FyBill
                    </div>
                </Link>
                {
                    company && (
                        <Link href={'/Dashboard'}>
                            <div className="logo font-bold text-3xl px-2 py-1 rounded-lg underline font-mono">
                                {company?.name}
                            </div>
                        </Link>
                    )
                }

                {
                    !User && (
                        <div className="">
                            <Button><Link href={'/Login'}>Get started</Link> </Button>
                        </div>

                    )
                }
                {
                    User &&

                    <div className="flex items-center space-x-4">

                        {/* Notification */}
                        {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="relative !rounded-button">
                                    <Bell className="h-5 w-5 text-gray-600" />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="max-h-[300px] overflow-y-auto">
                                    <div className="p-3 hover:bg-gray-50 cursor-pointer">
                                        <p className="text-sm font-medium">New subscription</p>
                                        <p className="text-xs text-gray-500">John Smith subscribed to Pro plan</p>
                                        <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                                    </div>
                                    <div className="p-3 hover:bg-gray-50 cursor-pointer">
                                        <p className="text-sm font-medium">Payment successful</p>
                                        <p className="text-xs text-gray-500">Invoice #12345 has been paid</p>
                                        <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                                    </div>
                                    <div className="p-3 hover:bg-gray-50 cursor-pointer">
                                        <p className="text-sm font-medium">New customer</p>
                                        <p className="text-xs text-gray-500">Emma Wilson created an account</p>
                                        <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <div className="p-2 text-center">
                                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 text-sm !rounded-button whitespace-nowrap">
                                        View all notifications
                                    </Button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu> */}


                        {/* Account */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded-full transition-colors">
                                    <Avatar className="h-8 w-8 ">
                                        <AvatarImage className='rounded-full cursor-pointer' src="/avatar.png" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl shadow-lg border bg-white border-gray-100">
                                <Link href={'/Profile'}>
                                    <div className="flex items-center p-2 mb-2p-2 rounded-lg hover:bg-indigo-50 transition-colors border-2">
                                        <Avatar className="h-10 w-10 mr-3">
                                            <AvatarImage className='rounded-full' src="/avatar.png" />
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-gray-800">{user?.name}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                </Link>
                                <DropdownMenuSeparator className="my-2" />
                                {
                                    User.role == "Owner" && (
                                        <Link href={'/Setting'}>
                                            <DropdownMenuItem className="cursor-pointer p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                                                <Settings className="h-4 w-4 mr-2 text-indigo-600" />
                                                <span>Settings</span>
                                            </DropdownMenuItem>
                                        </Link>

                                    )
                                }

                                <DropdownMenuSeparator className="my-2" />

                                <DropdownMenuItem onClick={Logout} className="cursor-pointer p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                }
            </div>
        </header>

    )
}
