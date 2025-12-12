'use client'
import React, { useState } from 'react';
import SuperAdminSidebar from './Sidebar';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <SuperAdminSidebar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <main
                className={`
                    transition-all duration-300 ease-in-out
                    ${isOpen ? 'md:ml-64' : 'md:ml-20'}
                    p-6
                `}
            >
                {children}
            </main>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </div>
    );
}
