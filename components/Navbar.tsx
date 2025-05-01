"use client";

import React from "react";

import Image from "next/image";
import LogoBlack from "@/public/LogoBlack.png";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter();

  return (
    <div className={` flex items-center  justify-between p-4 bg-custom-gradient`}>
      {/* Left Image (Placeholder) */}
      <div className="lg:ml-30 flex items-center justify-center">
        <Image src={LogoBlack} alt="Placeholder" className="w-16 h-16  rounded-md" />
        <h1 className="text-blue2Custom font-jetbrains  text-4xl">EZ</h1>
        <h1 className=" font-jetbrains text-4xl">Code</h1>
      </div>

      {/* Right Buttons */}
      <div className="lg:mr-30">
        <button
          onClick={() => router.push("/editor")}
          className="group relative  bg-black text-white w-40 py-3 rounded-full cursor-pointer font-jetbrains hover:bg-gray-800 transition-all duration-200 "
        >
          <span className="transition-opacity duration-200 group-hover:opacity-0">
            Start Coding
          </span>

          <span className="flex items-center justify-center absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">{`<{Start Coding}>`}</span>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
{
  /* <span className="group-hover:hidden">Start Coding</span>
          <span className="hidden group-hover:inline">{`<{Start Coding}>`}</span> */
}
