import Sidebar from "@/Components/Main/Sidebar";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (

        <div className="mt-20">
            <Sidebar />
            <div className="sm:ml-[16rem] px-4 pb-4">
                {children}
            </div>
        </div>


    );
}
