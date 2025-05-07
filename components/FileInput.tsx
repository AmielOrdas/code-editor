"use client";

import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { RootState } from "@/lib/redux/store";
import {
  setFileName,
  setFileError,
  setIsFileInputVisible,
  setIsFileInputSubmitting,
  setFiles,
} from "@/lib/redux/slice";
import axios from "axios";
export default function FileInput() {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const fileName = useSelector((state: RootState) => state.file.name);
  const error = useSelector((state: RootState) => state.file.error);
  const isSubmitting = useSelector((state: RootState) => state.file.isSubmitting);
  const isFileInputVisible = useSelector((state: RootState) => state.file.isInputVisible);
  const selectedFolderId = useSelector((state: any) => state.folder.selectedFolderId);
  const allowedLanguageExtensions = [".js", ".py", ".ts", ".cpp", ".java"];

  async function fetchFiles() {
    try {
      const response = await fetch("/api/files");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch files");
      }

      const { files } = await response.json();
      dispatch(setFiles(files));
    } catch (error) {
      console.error("Error fetching files:", error);
      dispatch(setFiles([])); // Clear the files in case of an error
    }
  }
  async function handleAddFile() {
    // You can add extension validation later
    console.log("File added!");
    dispatch(setIsFileInputSubmitting(true));
    const extension = fileName.substring(fileName.lastIndexOf(".") + 1); // Get the extension

    try {
      const response = await axios.post("/api/files", {
        name: fileName,
        folder_id: selectedFolderId || null, // null means root folder
        content: "", // Assuming content is empty for now
        extension: extension,
      });

      const data = response.data;
      console.log(response);
      if (response.status === 201) {
        dispatch(setFileName(""));
        dispatch(setIsFileInputVisible(false));
        fetchFiles();
      }
    } catch (error: any) {
      console.error("Error creating file:", error.response.data.message);

      dispatch(
        setFileError(
          error.response.data.message || "An error occured when creating the file"
        )
      );
    } finally {
      dispatch(setIsFileInputSubmitting(false));
    }
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;
    dispatch(setFileName(input));

    // Allow only valid characters: letters, numbers, dots, hyphens, underscores
    const validNameRegex = /^[a-zA-Z0-9._-]+$/;

    if (!input.trim()) {
      dispatch(setFileError(""));
      return;
    } else if (!validNameRegex.test(input)) {
      dispatch(setFileError("File name must not contain special characters or spaces."));
      return;
    }

    const lastDotIndex = input.lastIndexOf(".");
    const extension = input.substring(lastDotIndex);
    const baseName = input.substring(0, lastDotIndex).trim();

    if (lastDotIndex === -1) {
      dispatch(
        setFileError("File extension is required (e.g., .js, .py, .ts, .cpp, .java)")
      );
      return;
    }

    if (!baseName) {
      dispatch(setFileError("Extension only is not allowed"));
      return;
    }

    if (!allowedLanguageExtensions.includes(extension)) {
      dispatch(setFileError("Extension not allowed. Use .js, .py, .ts, .cpp, or .java"));
      return;
    }

    dispatch(setFileError(""));
  }

  function handleBlur() {
    if (error || !fileName.trim()) {
      dispatch(setFileError(""));
      dispatch(setFileName(""));
      dispatch(setIsFileInputVisible(false));
      return;
    }
    handleAddFile();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !fileName.trim()) {
      dispatch(setFileError(""));
      dispatch(setFileName(""));
      dispatch(setIsFileInputVisible(false));
      return;
    } else if (event.key === "Enter" && !error) {
      handleAddFile();
    }
  }

  if (!isFileInputVisible) return null;

  return (
    <div>
      <input
        type="text"
        autoFocus
        ref={inputRef}
        value={fileName}
        onChange={handleFileInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
        placeholder="Enter file name (e.g., file.cpp)"
        className={clsx("w-full bg-[#121212] text-orangeCustom border-2", {
          "border-red-500": error,
          "border-white": !error,
          "opacity-50 cursor-not-allowed": isSubmitting,
        })}
      />
      <p className="text-red-500 text-sm mt-2">{error}</p>
    </div>
  );
}
