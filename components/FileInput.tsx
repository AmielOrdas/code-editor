"use client";

import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { RootState } from "@/lib/redux/store";
import { setFileName, setFileError, setIsFileInputVisible } from "@/lib/redux/slice";

export default function FileInput({ handleAddFile }: { handleAddFile: () => void }) {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const fileName = useSelector((state: RootState) => state.file.name);
  const error = useSelector((state: RootState) => state.file.error);
  const isSubmitting = useSelector((state: RootState) => state.file.isSubmitting);
  const isFileInputVisible = useSelector((state: RootState) => state.file.isInputVisible);

  const allowedLanguageExtensions = [".js", ".py", ".ts", ".cpp", ".java"];

  // function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   const value = event.target.value;
  //   dispatch(setFileName(value));

  //   const isValid = /^[\w\-]+\.[\w]+$/.test(value); // Basic filename.extension check
  //   if (!value.trim()) {
  //     dispatch(setFileError("File name is required."));
  //     return;
  //   } else if (!isValid) {
  //     dispatch(setFileError("Invalid file name format (e.g., file.cpp)."));
  //     return;
  //   } else {
  //     dispatch(setFileError(""));
  //     return;
  //   }
  // }

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
    // if (event.key === "Enter") {
    //   // You can trigger file creation logic here or pass it via props
    //   inputRef.current?.blur();
    // }

    // Close input and return if user press enter without file name.
    if (event.key === "Enter" && !fileName.trim()) {
      dispatch(setFileError(""));
      dispatch(setFileName(""));
      dispatch(setIsFileInputVisible(false));
      return;
      // Add file if user press enter without any errors
    } else if (event.key === "Enter" && !error) {
      handleAddFile(); // Create file when Enter key is pressed
    }
  }

  if (!isFileInputVisible) return null;

  return (
    <div className="mt-4">
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
