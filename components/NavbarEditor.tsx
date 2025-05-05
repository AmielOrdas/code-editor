"use client";

import React from "react";

import Image from "next/image";
import LogoBlack from "@/public/LogoBlack.png";
import { useRouter } from "next/navigation";
import { ArrowLeft, FilePlus, FolderPlusIcon } from "lucide-react";

function NavbarEditor({
  setIsFileInputVisible,
}: {
  setIsFileInputVisible: (value: boolean) => void;
}) {
  const router = useRouter();

  return (
    <div className={` flex items-center  justify-between p-4 bg-custom-gradient`}>
      {/* Left Image (Placeholder) */}
      <div className=" flex items-center justify-center ">
        <ArrowLeft className="cursor-pointer" onClick={() => router.push("/")} />
      </div>
      <Image src={LogoBlack} alt={""} width={40} height={40} />
      {/* Right Buttons */}
      <div className="flex space-x-3">
        <FolderPlusIcon className="cursor-pointer" />
        <FilePlus
          className="cursor-pointer"
          onClick={() => setIsFileInputVisible(true)}
        />
      </div>
    </div>
  );
}

export default NavbarEditor;
