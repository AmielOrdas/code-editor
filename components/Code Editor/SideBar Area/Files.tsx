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

import { TFile } from "@/lib/Types&Constants";
import { deleteSchema } from "@/lib/zod";
import axios, { isAxiosError } from "axios";
import { fetchFiles } from "@/lib/functions";

export default function Files({
  parentId,
  level,
}: {
  parentId: string | null;
  level: number;
}) {
  // Access files from the redux state
  const files = useSelector((state: RootState) => state.file.files);
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
    console.log(selectedFileId);
  }

  function HandleIcon(extension: string) {
    let icon;

    switch (extension.toLowerCase()) {
      case "py":
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
    return icon;
  }

  async function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Delete" || event.key === "Del") {
      const confirmDelete = window.confirm("Are you sure you want to delete this file?");
      if (!confirmDelete) return;

      const parsed = deleteSchema.safeParse({ id: selectedFileId });

      if (!parsed.success) {
        const errorMessage = parsed.error.errors[0]?.message || "Invalid file ID";
        alert(errorMessage);
        return;
      }

      try {
        const response = await axios.delete("/api/files", {
          data: { id: selectedFileId },
        });

        if (response.status === 200) {
          await fetchFiles(dispatch);
        }
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          // If it's an Axios error, access the message safely
          const message = error?.response?.data.message || "Error deleting file";
          alert(message);
        } else {
          // If it's not an Axios error, handle it differently
          console.error("Unknown error occurred:", error);
          alert("An unexpected error occurred");
        }
      }
    }
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
                tabIndex={0}
                onClick={function () {
                  handleFileClick(file.id);
                }}
                onDoubleClick={function () {
                  handleFileOnDoubleClick(file.id);
                }}
                onKeyDown={handleKeyDown}
              >
                {HandleIcon(file.extension)}
                {renameFileId === file.id ? (
                  <RenameFileInput />
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
