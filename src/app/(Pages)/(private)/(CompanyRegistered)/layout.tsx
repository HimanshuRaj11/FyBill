'use client'
import NotCompany from "@/Components/Main/NotCompany";
import Sidebar from "@/Components/Main/Sidebar";
import { usePathname } from 'next/navigation'

import { useSelector } from "react-redux";



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname()

    const { User, loading } = useSelector((state: any) => state.User)
    const company = User?.user?.companyId

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    }
    if (!loading && !company) {
        return <NotCompany />
    }


    return (

        <div className="mt-20">
            {pathname != '/Bills/Create' && <Sidebar />}
            <div className={`${company && pathname != '/Bills/Create' ? 'sm:ml-[16rem]' : ''} px-4 pb-4`}>
                {children}
            </div>

        </div>


    );
}
