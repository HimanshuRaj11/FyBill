'use client'
import NotCompany from "@/Components/Main/NotCompany";
import Sidebar from "@/Components/Main/Sidebar";
import PreLoader from "@/Components/Other/PreLoader";
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname()

    const { Company, loading } = useSelector((state: any) => state.Company)
    const company = Company

    if (loading || !company) {
        return <PreLoader />
    }

    if (!company) {
        return <NotCompany />
    }

    return (
        <div className="mt-20">
            {pathname != '/Bills/Create' && <Sidebar />}
            <div className={`${company && pathname != '/Bills/Create' ? 'md:ml-[16rem]' : ''} px-4 pb-4`}>
                {children}
            </div>

        </div>

    );
}
