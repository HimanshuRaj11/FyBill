'use client'
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    GitBranch,
    Users,
    FileText,
    TrendingUp,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/Components/ui/theme-toggle';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (value: boolean) => void;
}

export default function SuperAdminSidebar({ isOpen, setIsOpen, isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path || pathname.startsWith(path);

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/SuperAdmin/Dashboard' },
        { name: 'Companies', icon: Building2, path: '/SuperAdmin/Companies' },
        { name: 'Branches', icon: GitBranch, path: '/SuperAdmin/Branches' },
        { name: 'Staffs', icon: Users, path: '/SuperAdmin/Staffs' },
        { name: 'Invoices', icon: FileText, path: '/SuperAdmin/Invoices' },
        { name: 'Sales', icon: TrendingUp, path: '/SuperAdmin/Sales' },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button variant="outline" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
            </div>

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed top-0 left-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
                    transition-all duration-300 ease-in-out
                    ${isOpen ? 'w-64' : 'w-20'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                        <AnimatePresence>
                            {isOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap"
                                >
                                    SuperAdmin
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden md:flex"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`
                                    flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden
                                    ${isActive(item.path)
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                                    }
                                `}
                            >
                                <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive(item.path) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100'}`} />

                                <span className={`ml-3 font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'}`}>
                                    {item.name}
                                </span>

                                {!isOpen && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    SA
                                </div>
                                <div className={`ml-3 transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">admin@fybill.com</p>
                                </div>
                            </div>
                            {isOpen && <ThemeToggle />}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
