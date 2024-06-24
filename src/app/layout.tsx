import type { Metadata } from "next";
import { Inter, Recursive, Roboto, Roboto_Flex, Roboto_Serif } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster"; 
import setupLocatorUI from "@locator/runtime";
import Providers from "@/components/Providers";
import { cunstructMetaData } from "@/lib/utils";
const googleFont = Roboto_Flex({ subsets: ["latin"] });



export const metadata: Metadata = cunstructMetaData()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {




  if (process.env.NODE_ENV !== "production") {
    setupLocatorUI(); 
  }
  return (
    <html lang="en">
      <body className={googleFont.className}>
        <NavBar />
        <main className="flex flex-col min-h-[calc(100vh-3.5rem-1px)] grainy-light">
          <div className="flex-1 flex flex-col h-full">
            <Providers>
            {children}
            </Providers>
          </div>
          <Footer />
        </main>
        <Toaster/>
      </body>
    </html>
  );
}
