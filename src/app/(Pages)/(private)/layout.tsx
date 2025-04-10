'use client'
import NotCompany from "@/Components/Main/NotCompany";
import Sidebar from "@/Components/Main/Sidebar";
import { useSelector } from "react-redux";



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { Company } = useSelector((state: any) => state.Company)
    const company = Company?.company


    return (

        <div className="mt-20">
            <div className={`px-4 pb-4`}>
                {children}
            </div>

        </div>


    );
}
