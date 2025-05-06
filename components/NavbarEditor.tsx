"use client";

import React from "react";

import Image from "next/image";
import LogoBlack from "@/public/LogoBlack.png";
import { useRouter } from "next/navigation";
import { ArrowLeft, FilePlus, FolderPlusIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsFileInputVisible,
  setIsFolderInputVisible,
  setFileName,
  setFolderName,
  setIsSubFolderInputVisible,
} from "@/lib/redux/slice";
import { RootState } from "@/lib/redux/store";
/*
{
  setIsFileInputVisible,
  setIsFolderInputVisible,
  setFileName,
  setFolderName,
}: {
  setIsFileInputVisible: (value: boolean) => void;
  setIsFolderInputVisible: (value: boolean) => void;
  setFileName: (value: string) => void;
  setFolderName: (value: string) => void;
} 
*/

function NavbarEditor() {
  const router = useRouter();
  const selectedFolderId = useSelector(
    (state: RootState) => state.folder.selectedFolderId
  ); // Get selected folder ID
  const dispatch = useDispatch();

  function handleFilePlusClick() {
    dispatch(setIsFileInputVisible(true));
    dispatch(setIsFolderInputVisible(false));
    dispatch(setFolderName(""));
  }

  function handleFolderPlusClick() {
    console.log(selectedFolderId);
    if (selectedFolderId) {
      dispatch(setIsSubFolderInputVisible(true));
      dispatch(setIsFolderInputVisible(false));
      dispatch(setFolderName(""));

      dispatch(setIsFileInputVisible(false));
      dispatch(setFileName(""));
    } else {
      dispatch(setIsFolderInputVisible(true));
      dispatch(setIsFileInputVisible(false));
      dispatch(setFileName(""));
    }
  }

  return (
    <div className={` flex items-center  justify-between p-4 bg-custom-gradient`}>
      {/* Left Image (Placeholder) */}
      <div className=" flex items-center justify-center ">
        <ArrowLeft className="cursor-pointer" onClick={() => router.push("/")} />
      </div>
      <Image src={LogoBlack} alt={""} width={40} height={40} />
      {/* Right Buttons */}
      <div className="flex space-x-3">
        <FolderPlusIcon className="cursor-pointer" onClick={handleFolderPlusClick} />
        <FilePlus className="cursor-pointer" onClick={handleFilePlusClick} />
      </div>
    </div>
  );
}

export default NavbarEditor;
