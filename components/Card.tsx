import React from "react";
import Logo from "@/public/LogoBlack.png";
import Image, { StaticImageData } from "next/image";
import { Images } from "lucide-react";
export default function Card({
  image = Logo,
  imageClassName = "mx-auto size-30 ",
  hasImage = true,
  heading = "HEADING",
  description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it make a type specimen book.",
  lucideReact = <Images className="mx-auto size-30 mt-5" />,
}: {
  image?: StaticImageData;
  hasImage?: boolean;
  heading?: string;
  description?: string;
  lucideReact?: React.ReactNode;
  imageClassName?: string;
}) {
  return (
    <div className="relative w-full my-8">
      <div className="flex justify-center relative px-4 mx-auto w-fit">
        {/* Left bracket */}
        <div className="h-70 w-10  lg:h-90 lg:w-20 border-t border-b border-l border-black "></div>
        {/* Content */}
        <div className={`flex flex-col w-auto max-w-[500px]`}>
          {/* Image  */}

          {hasImage ? (
            <Image src={image} alt="Content" className={imageClassName} />
          ) : (
            lucideReact
          )}

          {/* Text Section  */}
          <div className="space-y-2 max-w-[500px] lg:max-w-[350px] text-center mb-5 ">
            <h2 className="text-xl font-bold text-black  ">{heading}</h2>
            <p className="text-gray-800 text-sm">{description}</p>
          </div>
        </div>

        {/* Right bracket */}
        <div className="h-70 w-10 lg:h-90 lg:w-20 border-t border-b border-r border-black "></div>
      </div>
    </div>
  );
}
