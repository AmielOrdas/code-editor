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
} from "@/lib/redux/slice";
import axios, { isAxiosError } from "axios";
import { fetchFiles } from "@/lib/functions";

import { createFileSchema } from "@/lib/zod";
export default function FileInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const fileName = useSelector((state: RootState) => state.file.name);
  const error = useSelector((state: RootState) => state.file.error);
  const isSubmitting = useSelector((state: RootState) => state.file.isSubmitting);
  const isFileInputVisible = useSelector((state: RootState) => state.file.isInputVisible);
  const selectedFolderId = useSelector(
    (state: RootState) => state.folder.selectedFolderId
  );

  const dispatch = useDispatch();

  async function handleAddFile() {
    dispatch(setIsFileInputSubmitting(true));
    const extension = fileName.substring(fileName.lastIndexOf(".") + 1); // Get the extension

    // Validate file data using Zod schema
    const parsed = createFileSchema.safeParse({
      name: fileName,
      folder_id: selectedFolderId || "",
      content: "",
      extension: extension,
    });

    if (!parsed.success) {
      // Get the first error message from the Zod validation
      const errorMessage = parsed.error.errors[0]?.message;
      dispatch(setFileError(errorMessage || "Invalid file data"));
      dispatch(setIsFileInputSubmitting(false));
      return;
    }

    try {
      const response = await axios.post("/api/files", {
        name: fileName,
        folder_id: selectedFolderId || "", // null means below main folder
        content: "",
        extension: extension,
      });

      if (response.status === 201) {
        dispatch(setFileName(""));
        dispatch(setIsFileInputVisible(false));
        fetchFiles(dispatch);
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        // If it's an Axios error, safely access the message
        console.error("Error creating file:", error?.response?.data.message);

        dispatch(
          setFileError(
            error?.response?.data.message || "An error occurred when creating the file"
          )
        );
      } else {
        // If it's not an Axios error, handle it differently
        console.error("Unknown error occurred:", error);
        dispatch(setFileError("An unexpected error occurred"));
      }
    }
    dispatch(setIsFileInputSubmitting(false));
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;
    dispatch(setFileName(input));
    const extension = input.substring(fileName.lastIndexOf(".") + 1); // Get the extension

    const parsed = createFileSchema.safeParse({
      name: input,
      folder_id: "", // Use the actual folder ID here if needed
      content: "", // Use the actual content here if needed
      extension: extension,
    });

    if (!parsed.success) {
      // Get the first error message
      const errorMessage = parsed.error.errors[0]?.message;

      if (errorMessage === "File name is required") {
        dispatch(setFileError(""));
      } else {
        dispatch(setFileError(errorMessage));
      }
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
