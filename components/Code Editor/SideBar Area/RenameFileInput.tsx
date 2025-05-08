"use client";

import axios, { isAxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  setFileRenameError,
  setFileName,
  setFiles,
  setRenameFileId,
  setIsFileRenameInputSubmitting,
} from "@/lib/redux/slice";
import clsx from "clsx";

import { renameFileSchema } from "@/lib/zod";

export default function RenameInput() {
  const fileName = useSelector((state: RootState) => state.file.name);

  const selectedFileId = useSelector((state: RootState) => state.file.selectedFileId);
  const error = useSelector((state: RootState) => state.file.renameError);

  const isSubmitting = useSelector(
    (state: RootState) => state.file.isRenameInputSubmitting
  );

  const dispatch = useDispatch();
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

  async function handleRenameFile() {
    // You can add extension validation later
    console.log("File added!");
    dispatch(setIsFileRenameInputSubmitting(true));
    const extension = fileName.substring(fileName.lastIndexOf(".") + 1); // Get the extension

    // Allow only valid characters: letters, numbers, dots, hyphens, underscores
    const parsed = renameFileSchema.safeParse({
      id: selectedFileId,
      name: fileName,
      extension: extension,
    });

    if (!parsed.success) {
      // Get the first error message
      const errorMessage = parsed.error.errors[0]?.message;

      if (errorMessage === "File name is required") {
        dispatch(setFileRenameError(""));
      } else {
        dispatch(setFileRenameError(errorMessage));
      }
      return;
    }

    try {
      const response = await axios.patch("/api/files", {
        id: selectedFileId,
        name: fileName,

        extension: extension,
      });

      console.log(response);
      if (response.status === 200) {
        dispatch(setFileName(""));
        dispatch(setRenameFileId(""));
        fetchFiles();
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        // If it's an Axios error, safely access the message
        console.error("Error creating file:", error);

        dispatch(
          setFileRenameError(
            error.response?.data?.message || "An error occurred when creating the file"
          )
        );
      } else {
        // If it's not an Axios error, handle it differently
        console.error("Unknown error occurred:", error);
        dispatch(setFileRenameError("An unexpected error occurred"));
      }
    }

    dispatch(setRenameFileId(""));
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;
    dispatch(setFileName(input));
    const extension = input.substring(fileName.lastIndexOf(".") + 1); // Get the extension

    if (!input.trim()) {
      dispatch(setFileRenameError(""));
      return;
    }

    // Allow only valid characters: letters, numbers, dots, hyphens, underscores
    const parsed = renameFileSchema.safeParse({
      id: selectedFileId,
      name: input,
      extension: extension,
    });

    if (!parsed.success) {
      // Get the first error message
      const errorMessage = parsed.error.errors[0]?.message;

      if (errorMessage === "File name is required") {
        dispatch(setFileRenameError(""));
      } else {
        dispatch(setFileRenameError(errorMessage));
      }
      return;
    }

    dispatch(setFileRenameError(""));
  }

  function handleBlur() {
    if (error || !fileName.trim()) {
      dispatch(setFileRenameError(""));
      dispatch(setFileName(""));
      dispatch(setRenameFileId(""));
      return;
    }
    handleRenameFile();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    // if (event.key === "Enter") {
    //   // You can trigger file creation logic here or pass it via props
    //   inputRef.current?.blur();
    // }

    // Close input and return if user press enter without file name.
    if (event.key === "Enter" && !fileName.trim()) {
      dispatch(setFileRenameError(""));
      dispatch(setFileName(""));
      dispatch(setRenameFileId(""));
      return;
      // Add file if user press enter without any errors
    } else if (event.key === "Enter" && !error) {
      handleRenameFile(); // Create file when Enter key is pressed
    }
  }

  // if (!isRenameInputVisible) return null;

  return (
    <div>
      <input
        className={clsx("w-full bg-[#121212] text-orangeCustom border", {
          "border-red-500": error,
          "border-b": !error,
          "opacity-50 cursor-not-allowed": isSubmitting,
        })}
        type="text"
        value={fileName}
        onChange={handleFileInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        disabled={isSubmitting}
      />
    </div>
  );
}
