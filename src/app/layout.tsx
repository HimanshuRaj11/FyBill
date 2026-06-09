import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Main/Navbar";
import { ToastContainer } from "react-toastify";
import Providers from "./Redux/ReduxProvider";
import { GlobalContextProvider } from "@/context/contextProvider";
import { ThemeProvider } from "@/Components/ui/theme-provider";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aarna Indian Food",
  description: "Aarna Indian Food is a restaurant management system built using Next.js, React, and Tailwind CSS. It offers features such as order management, inventory tracking, and customer relationship management to help streamline restaurant operations and enhance the dining experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-200 dark:bg-[#09090B]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <GlobalContextProvider>

              <ToastContainer />
              <Navbar />
              <div className="mt-20">
                <div className="sm:px-4 pb-4">
                  {children}
                </div>

              </div>

            </GlobalContextProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
