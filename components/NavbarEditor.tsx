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
  setRenameFileId,
  setRenameFolderId,
} from "@/lib/redux/slice";
import { RootState } from "@/lib/redux/store";

function NavbarEditor({
  buttonsRef,
}: {
  buttonsRef: React.RefObject<HTMLDivElement | null>;
}) {
  const router = useRouter();
  const selectedFolderId = useSelector(
    (state: RootState) => state.folder.selectedFolderId
  ); // Get selected folder ID
  const dispatch = useDispatch();

  function handleFilePlusClick() {
    dispatch(setIsFileInputVisible(true));
    dispatch(setIsFolderInputVisible(false));
    dispatch(setFolderName(""));
    dispatch(setFileName(""));
    dispatch(setRenameFolderId(""));
    console.log("HELLO");
  }

  function handleFolderPlusClick() {
    // if (selectedFolderId) {
    //   console.log(selectedFolderId);
    //   dispatch(setIsFolderInputVisible(true));
    //   return;
    // } else {
    //   dispatch(setIsFolderInputVisible(true));
    // }
    dispatch(setIsFolderInputVisible(true));

    dispatch(setIsFileInputVisible(false));
    dispatch(setRenameFileId(""));
    dispatch(setRenameFileId(""));
    dispatch(setRenameFolderId(""));

    // if (selectedFolderId) {
    //   // dispatch(setIsSubFolderInputVisible(false));
    //   dispatch(setIsFolderInputVisible(true));
    //   dispatch(setFolderName(""));

    //   dispatch(setIsFileInputVisible(false));
    //   dispatch(setFileName(""));
    // } else {
    //   dispatch(setIsFolderInputVisible(true));
    //   dispatch(setIsFileInputVisible(false));
    //   dispatch(setFileName(""));
    // }
  }

  return (
    <div className={` flex items-center  justify-between p-4 bg-custom-gradient`}>
      {/* Left Image (Placeholder) */}
      <div className=" flex items-center justify-center ">
        <ArrowLeft className="cursor-pointer" onClick={() => router.push("/")} />
      </div>
      <Image src={LogoBlack} alt={""} width={40} height={40} />
      {/* Right Buttons */}
      <div className="flex space-x-3" ref={buttonsRef}>
        <FolderPlusIcon className="cursor-pointer" onClick={handleFolderPlusClick} />
        <FilePlus className="cursor-pointer" onClick={handleFilePlusClick} />
      </div>
    </div>
  );
}

export default NavbarEditor;
