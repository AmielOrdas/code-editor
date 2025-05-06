import React from "react";
import { FolderPlusIcon, FilePlus } from "lucide-react";
import { useRouter } from "next/navigation";

function FolderBar() {
  const router = useRouter();

  return (
    <div className={`flex items-center justify-between p-4 bg-custom-gradient`}>
      {/* Right Buttons */}
      <div className="flex space-x-3">
        <FolderPlusIcon className="cursor-pointer" />
        <FilePlus className="cursor-pointer" />
      </div>
    </div>
  );
}

export default FolderBar;
