import { Facebook, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import React from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function Footer() {
  return (
    <div className="">
      <div className="bg-red2Custom flex justify-between items-center p-3">
        <h2 className="text-3xl font-semibold text-black ml-10">
          Get Connected with us!
        </h2>
        <div className="flex space-x-4">
          <Popover>
            <PopoverTrigger className="flex space-x-4">
              <Facebook />
              <Twitter />
              <Youtube />
            </PopoverTrigger>
            <PopoverContent>The icon links are just for visual purposes</PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="bg-greenCustom space-y-2 p-15">
        <h2 className="text-3xl font-bold text-black">Contacts</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin />
            <p className="text-sm text-black font-semibold">Quezon City, Philippines</p>
          </div>
          <div className="flex items-center space-x-2">
            <Mail />
            <p className="text-sm text-black font-semibold">EZCode@outlook.com</p>
          </div>
          <div className="flex items-center space-x-2">
            <Phone />
            <p className="text-sm text-black font-semibold">+631932456123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
