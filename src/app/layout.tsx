import type { Metadata } from "next";
import { Bai_Jamjuree } from "next/font/google"; // ganti Inter ke Bai_Jamjuree
import "./globals.css";
import Header from "@/components/Header"; // Pastikan path sesuai
import { Toaster } from 'sonner';
import { OperasiProvider } from "@/contexts/OperasiContext";
import { MapProvider } from "@/contexts/MapContext";
import { DeteksiProvider } from "@/contexts/DeteksiContext";

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"], // pilih sesuai kebutuhanmu
  variable: "--font-bai-jamjuree-extralight", // ini nanti digunakan di Tailwind
});

export const metadata: Metadata = {
  title: "RPMS",
  description: "RPMS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-accent">
        <MapProvider>
           <OperasiProvider>
            <DeteksiProvider>
        <Toaster richColors position="top-center"
         />
        <Header />
        <main className="flex-1 pt-[96px] overflow-hidden">{children}</main>
        </DeteksiProvider>
        </OperasiProvider>
        </MapProvider>
      </body>
    </html>
  );
}



