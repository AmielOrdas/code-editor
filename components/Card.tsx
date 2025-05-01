import React from "react";
import Logo from "@/public/LogoBlack.png";
import Image, { StaticImageData } from "next/image";
export default function Card({ image = Logo }: { image?: StaticImageData }) {
  return (
    <div className="relative w-full my-8">
      <div className="flex justify-center relative px-4 mx-auto w-fit">
        {/* Left bracket */}
        <div className="h-70 w-10  lg:h-90 lg:w-20 border-t border-b border-l border-black "></div>
        {/* Content */}
        <div className={`flex flex-col w-auto max-w-[500px]`}>
          {/* Image  */}

          <Image src={image} alt="Content" className="mx-auto size-30 " />

          {/* Text Section  */}
          <div className="space-y-2 max-w-[500px] lg:max-w-[350px] text-center mb-5 ">
            <h2 className="text-xl font-semibold text-gray-700  ">HEADING</h2>
            <p className="text-gray-600 text-sm">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the
              1500s, when an unknown printer took a galley of type and scrambled it to
              make a type specimen book.
            </p>
          </div>
        </div>

        {/* Right bracket */}
        <div className="h-70 w-10 lg:h-90 lg:w-20 border-t border-b border-r border-black "></div>
      </div>
    </div>
  );
}
