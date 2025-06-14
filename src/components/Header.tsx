"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import MobileNav from "./MobileNav";
import ModalSettings from "./ModalSettings";
import { useRadarConnect } from "@/hooks/useRadarConnect";

const Header = () => {
  const { isConnected, isOperasiSiap, isLoading, toggleConnection } = useRadarConnect();

  return (
    <header className="absolute top-0 left-0 w-full py-5 xl:py-4 text-white z-50 bg-primary">
      <div className="w-full px-4 flex items-center justify-between">
        {/* Logo dan Judul */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo-5.svg"
            alt="Logo RPMS"
            width={60}
            height={40}
            className="object-contain xl:w-[90px] xl:h-[60px]"
          />
          <h1 className="text-base font-bold sm:text-lg md:text-xl xl:text-3xl leading-tight">
            RIFLE PERIMETER MANAGEMENT SYSTEM
            <span className="text-accent">.</span>
          </h1>
        </div>

        {/* Tombol Connect */}
        <div className="hidden xl:flex items-center gap-2">
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

          <ModalSettings />
        </div>

        {/* Mobile Navigation */}
        <div className="xl:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
