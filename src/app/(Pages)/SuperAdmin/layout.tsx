import React from 'react';
import SuperAdminLayout from '@/Components/SuperAdmin/SuperAdminLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SuperAdminLayout>
            {children}
        </SuperAdminLayout>
    );
}
