'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { FaBars, FaTachometerAlt, FaFileInvoice, FaUsers, FaBox, FaCog, FaSignInAlt, FaUserPlus, FaFileInvoiceDollar } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
export default function Sidebar() {
    const { User } = useSelector((state: any) => state.User)
    const user = User
    const router = useRouter()

    if (!user) {
        router.push('/')
    }

    const pathname = usePathname();
    const isActive = (path: string) => path === pathname || pathname.startsWith(path);

    const [ShowSidebar, setShowSidebar] = useState(false)
    return (
        <div>
            {
                user &&
                <div className='relative'>


                    <aside id="default-sidebar" className={`fixed top-20 left-2 z-40 w-64 h-[88vh] transition-transform -translate-x-full sm:translate-x-0 ${ShowSidebar ? "translate-x-0" : ""} `} aria-label="Sidebar">
                        <Button variant={'ghost'} onClick={() => setShowSidebar(!ShowSidebar)} data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex left-60 fixed items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                            <span className="sr-only">Open sidebar</span>
                            <FaBars className="w-6 h-6" aria-hidden="true" />
                        </Button>
                        <div className="h-full px-3 py-4 overflow-y-auto rounded-2xl  bg-gray-50 dark:bg-gray-800">
                            <ul className="space-y-2 font-medium">
                                {
                                    User?.role == "Owner" && (
                                        <>
                                            <li>
                                                <Link href="/Dashboard" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group ${isActive('/Dashboard') ? 'bg-gray-300 dark:bg-gray-700' : ''}`}>
                                                    <FaTachometerAlt className={`w-5 h-5 transition duration-75 ${isActive('/Dashboard') ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'} group-hover:text-gray-900 dark:group-hover:text-white`} aria-hidden="true" />
                                                    <span className="ms-3">Dashboard</span>
                                                </Link>
                                            </li>

                                            <li>
                                                <Link href="/Staff" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group ${isActive('/Staff') ? 'bg-gray-300 dark:bg-gray-700' : ''}`}>
                                                    <FaUsers className={`shrink-0 w-5 h-5 transition duration-75 ${isActive('/Staff') ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'} group-hover:text-gray-900 dark:group-hover:text-white`} aria-hidden="true" />
                                                    <span className="flex-1 ms-3 whitespace-nowrap">Staff Members</span>
                                                </Link>
                                            </li>
                                        </>
                                    )
                                }


                                <li>
                                    <Link href="/Invoice" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group ${isActive('/Invoice') ? 'bg-gray-300 dark:bg-gray-700' : ''}`}>
                                        <FaFileInvoice className={`shrink-0 w-5 h-5 transition duration-75 ${isActive('/Invoice') ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'} group-hover:text-gray-900 dark:group-hover:text-white`} aria-hidden="true" />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Invoice</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/Products" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group ${isActive('/Products') ? 'bg-gray-300 dark:bg-gray-700' : ''}`}>
                                        <FaBox className={`shrink-0 w-5 h-5 transition duration-75 ${isActive('/Products') ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'} group-hover:text-gray-900 dark:group-hover:text-white`} aria-hidden="true" />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/Bills/Create" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group ${isActive('/Bills/Create') ? 'bg-gray-300 dark:bg-gray-700' : ''}`}>
                                        <FaFileInvoiceDollar className={`shrink-0 w-5 h-5 transition duration-75 ${isActive('/Bills/Create') ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'} group-hover:text-gray-900 dark:group-hover:text-white`} aria-hidden="true" />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Create Bill</span>
                                    </Link>
                                </li>

                            </ul>
                        </div>
                    </aside>
                </div>
            }

        </div>
    )
}