"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { CiMenuFries } from "react-icons/ci";
import { useEffect, useState } from "react";
import { useRadarConnect } from "@/hooks/useRadarConnect";
import Image from "next/image";
import axios from "axios";
import { Button } from "./ui/button";
import ModalSettings from "./ModalSettings";



const MobileNav = () => {
  const { isConnected, isOperasiSiap, isLoading, toggleConnection } = useRadarConnect();
  const [isClient, setIsClient] = useState(false);
   
     // Cek status API saat pertama kali render
      useEffect(() => {
      setIsClient(true);
    }, []);

  return (
    <Sheet>
      <SheetTrigger className="flex justify-center items-center">
        <CiMenuFries className="text-[32px] text-accent" />
      </SheetTrigger>
      <SheetContent className="flex flex-col items-center h-full overflow-y-auto">
        {/* Logo */}
           <div className="flex flex-col items-center text-center mb-16">
          <Image
            src="/logo-5.svg"
            alt="Logo RPMS"
            width={90}
            height={60}
            className="object-contain mb-4"
          />
          <h1 className="text-2xl font-bold max-w-xs leading-snug">
            RIFLE PERIMETER MANAGEMENT SYSTEM
            <span className="text-accent">.</span>
          </h1>
        </div>

        {/* Tombol WhatsApp */}
        <div className="mt-10">
      {isClient && (
            <Button
              onClick={toggleConnection}
              disabled={!isOperasiSiap || isLoading}
              className={`rounded-3xl px-10 py-6 text-white text-xl transition-colors ${
                !isOperasiSiap
                  ? "bg-gray-400 cursor-not-allowed"
                  : isConnected
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isLoading
                ? "Loading..."
                : !isOperasiSiap
                ? "Start Required"
                : isConnected
                ? "Disconnect"
                : "Connect"}
            </Button>
          )}
        </div>
         <div className="mt-10">
             <ModalSettings />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
