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
  title: "FyBill",
  description: "FyBill",
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
