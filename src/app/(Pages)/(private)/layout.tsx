
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <div className="mt-20">
            <div className={`px-4 pb-4`}>
                {children}
            </div>

        </div>


    );
}
