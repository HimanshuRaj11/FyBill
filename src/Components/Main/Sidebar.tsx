'use client'
import React, { useState } from 'react';
import { FaBars, FaTachometerAlt, FaFileInvoice, FaUsers, FaBox, FaCog, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function Sidebar() {

    const isUserLogin = true;
    return (
        <div>
            {
                isUserLogin &&
                <>
                    <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                        <span className="sr-only">Open sidebar</span>
                        <FaBars className="w-6 h-6" aria-hidden="true" />
                    </button>

                    <aside id="default-sidebar" className="fixed top-20 left-2 z-40 w-64 h-[88vh] transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                        <div className="h-full px-3 py-4 overflow-y-auto rounded-2xl  bg-gray-50 dark:bg-gray-800">
                            <ul className="space-y-2 font-medium">
                                <li>
                                    <a href="/Dashboard" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        <FaTachometerAlt className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" />
                                        <span className="ms-3">Dashboard</span>
                                    </a>
                                </li>

                                <li>
                                    <a href="/Invoice" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        <FaFileInvoice className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Invoice</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/Staff" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        <FaUsers className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Staff Members</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/Products" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        <FaBox className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
                                    </a>
                                </li>

                            </ul>
                        </div>
                    </aside>
                </>
            }


        </div>
    )
}