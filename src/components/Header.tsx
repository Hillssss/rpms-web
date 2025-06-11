"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MobileNav from "./MobileNav";
import axios from "axios";
import ModalSettings from "./ModalSettings";


const Header = () => {
  const [isConnected, setIsConnected] = useState(false); // untuk toggle connect/disconnect
  const [apiAvailable, setApiAvailable] = useState(false); // status API up/down

  // Cek status API saat pertama kali render
  useEffect(() => {
    const checkAPI = async () => {
      try {
        // Ganti URL di bawah dengan endpoint healthcheck atau ping API kamu
        const response = await axios.get("http://localhost:3000/api/ping");
        if (response.status === 200) {
          setApiAvailable(true); // API hidup
        } else {
          setApiAvailable(false);
        }
      } catch (error) {
        setApiAvailable(false); // error = API mati
      }
    };

    checkAPI();
  }, []);

  const handleClick = () => {
    // hanya izinkan klik jika API tersedia
    if (apiAvailable) {
      setIsConnected((prev) => !prev);
    }
  };
  return (
    <header className="absolute top-0 left-0 w-full py-5 xl:py-4 text-white z-50 bg-primary">
      <div className="w-full px-4 flex items-center justify-between">
  {/* Logo dan Judul dibungkus agar sejajar */}
  <div className="flex items-center gap-2">
   <Image
        src="/logo-5.svg"
        alt="Logo RPMS"
        width={60} // default mobile
        height={40}
        className="object-contain xl:w-[90px] xl:h-[60px]"
      />
      <h1 className="text-base font-bold sm:text-lg md:text-xl xl:text-3xl leading-tight">
        RIFLE PERIMETER MANAGEMENT SYSTEM
        <span className="text-accent">.</span>
      </h1>
    </div>

  {/* Tombol hanya muncul di layar besar */}
  <div className="hidden xl:flex items-center gap-2">
    <Button
      onClick={handleClick}
      disabled={!apiAvailable} // disable saat API mati
      className={`rounded-3xl px-10 py-6 text-white text-xl transition-colors ${
        !apiAvailable
          ? "bg-gray-400 cursor-not-allowed"
          : isConnected
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-500 hover:bg-green-600"
      }`}
    >
      {!apiAvailable
        ? "Not Connected"
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
