"use client";
import React from "react";
import Logo from "@/public/LogoBlack.png";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
function ContentWithImageAndText() {
  const router = useRouter();
  return (
    <div className="bg-orangeCustom flex flex-col lg:flex-row items-center justify-center min-h-screen p-4">
      {/* Text Section (moved to the left on larger screens) */}

      {/* Image Above */}
      <div className="w-full sm:size-60 lg:hidden lg:max-w-md mt-8 lg:mt-0 lg:w-1/2">
        <Image src={Logo} alt="Content" className="w-full rounded-md" />
      </div>

      <div className="text-center text-gray-800 space-y-4 lg:text-left lg:w-1/2 lg:pr-8">
        <span className="sm: text-2xl lg:text-5xl"> Welcome to </span>
        <span className="text-blue2Custom font-jetbrains sm: text-2xl lg:text-5xl">
          EZ
        </span>
        <span className="font-jetbrains sm: text-2xl lg:text-5xl">Code,</span>
        <span className="sm: text-2xl lg:text-5xl">
          a web-based code editor that allows you to{" "}
        </span>{" "}
        <span className="text-blue2Custom font-jetbrains sm: text-2xl lg:text-5xl">
          EZ
        </span>
        <span className="sm: text-2xl lg:text-5xl">ily start coding!</span>
        <h1></h1>
        <h1>
          EZCode supports multiple programming languages like JavaScript, Python, C++ and
          many more.
        </h1>
        <button
          className="group relative bg-black text-white w-40 py-3 rounded-full cursor-pointer font-jetbrains hover:bg-gray-800  "
          onClick={() => router.push("/editor")}
        >
          <span className="flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
            Try now
            <ArrowRight className="ml-2" />
          </span>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {`<{Try now}>`}
            <ArrowRight className="ml-2" />
          </div>
        </button>
      </div>

      {/* Image on the Right */}
      <div className="w-full hidden lg:block max-w-md mt-8 md:mt-0 md:w-1/2">
        <Image src={Logo} alt="Content" className="w-full rounded-md" />
      </div>
    </div>
  );
}

export default ContentWithImageAndText;
