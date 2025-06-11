"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaCogs } from "react-icons/fa";

import ResponsiveTabs from "./ResponsiveTabs";


const  ModalSettings = () => {
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    // TODO: Tambahkan logika penyimpanan data di sini
    console.log("Data disimpan");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="superIcon"
          onClick={() => setOpen(true)}
        >
          <FaCogs className="text-white hover:text-primary" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] sm:max-w-2xl w-full px-4 sm:px-6 py-6 rounded-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-4">Settings</DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(90vh-150px)] overflow-y-auto pr-2">
          <ResponsiveTabs />
        </div>

        {/* Responsive Footer */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-4">
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={handleSave}
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalSettings;


