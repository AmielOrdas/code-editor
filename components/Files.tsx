"use client";

import { RootState } from "@/lib/redux/store";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedFolderId,
  setSelectedFileId,
  setRenameFileId,
} from "@/lib/redux/slice";
import { FileText } from "lucide-react";
import RenameFileInput from "./RenameFileInput";
import JavaIcon from "@/public/File Icons/Java_programming_language_logo.svg-removebg-preview.png";
import JavaScriptIcon from "@/public/File Icons/Unofficial_JavaScript_logo_2.svg.png";
import TypeScriptIcon from "@/public/File Icons/Typescript_logo_2020.svg.png";
import CppIcon from "@/public/File Icons/ISO_C++_Logo.svg-removebg-preview.png";
import PythonIcon from "@/public/File Icons/Python-logo-notext.svg.png";
import Image from "next/image";

type TFile = {
  id: string;
  name: string;
  extension: string;
  folder_id: string | null;
};

export default function Files({
  parentId,
  level,
}: {
  parentId: string | null;
  level: number;
}) {
  // Access files from the redux state
  const files = useSelector((state: any) => state.file.files);
  const nestedFiles = files.filter((f: TFile) => f.folder_id === parentId);
  const selectedFileId = useSelector((state: RootState) => state.file.selectedFileId);
  const renameFileId = useSelector((state: RootState) => state.file.renameFileId);
  const FileRenameError = useSelector((state: RootState) => state.file.renameError);
  const dispatch = useDispatch();

  function handleFileOnDoubleClick(fileId: string) {
    dispatch(setRenameFileId(fileId));
    dispatch(setSelectedFolderId(""));
  }

  function handleFileClick(fileId: string) {
    dispatch(setSelectedFileId(fileId));
    dispatch(setSelectedFolderId(""));
  }

  function HandleIcon(extension: string) {
    let icon;
    console.log(extension);
    switch (extension.toLowerCase()) {
      case "py":
        console.log("PYTHON!");
        icon = <Image src={PythonIcon} alt="" width={20} className="mr-2" />;
        break;
      case "js":
        icon = <Image src={JavaScriptIcon} alt="" width={20} className="mr-2" />;
        break;
      case "ts":
        icon = <Image src={TypeScriptIcon} alt="" width={20} className="mr-2" />;
        break;
      case "java":
        icon = <Image src={JavaIcon} alt="" height={20} className="mr-2" />;
        break;
      case "cpp":
        icon = <Image src={CppIcon} alt="" width={20} className="mr-2" />;
        break;
      default:
        icon = <FileText className="mr-2" />;
        break;
    }
    console.log(icon);
    return icon;
  }

  return (
    <>
      {nestedFiles.map(function (file: TFile) {
        return (
          <ul key={file.id} style={{ marginLeft: `${level === 0 ? 10 : level * 15}px` }}>
            <li>
              <div
                className={clsx("text-white cursor-pointer flex items-center ml-8", {
                  "bg-custom-gradient w-full": file.id === selectedFileId,
                })}
                onClick={function () {
                  handleFileClick(file.id);
                }}
                onDoubleClick={function () {
                  handleFileOnDoubleClick(file.id);
                }}
              >
                {/* <FileText className="text-white mr-2" /> */}
                {HandleIcon(file.extension)}
                {renameFileId === file.id ? (
                  <RenameFileInput fileId={file.id} />
                ) : (
                  <span className="text-orange2Custom">{file.name}</span>
                )}
              </div>
              {renameFileId === file.id && FileRenameError && (
                <p className="text-red-500 text-sm ml-1 mb-2">{FileRenameError}</p>
              )}
            </li>
          </ul>
        );
      })}
    </>
  );
}
