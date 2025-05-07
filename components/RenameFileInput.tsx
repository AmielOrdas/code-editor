"use client";

import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  setFileRenameError,
  setFileName,
  setFiles,
  setIsFileInputSubmitting,
  setRenameFileId,
  setIsFileRenameInputSubmitting,
} from "@/lib/redux/slice";
import clsx from "clsx";

export default function RenameInput({ fileId }: { fileId?: string }) {
  const fileName = useSelector((state: RootState) => state.file.name);

  const selectedFileId = useSelector((state: RootState) => state.file.selectedFileId);
  const error = useSelector((state: RootState) => state.file.renameError);
  const allowedLanguageExtensions = [".js", ".py", ".ts", ".cpp", ".java"];
  const isSubmitting = useSelector(
    (state: RootState) => state.file.isRenameInputSubmitting
  );

  // const isRenameInputVisible = useSelector(
  //   (state: RootState) => state.file.isRenameInputVisible
  // );

  // console.log("RENAME FILE INPUT", isRenameInputVisible);

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
    console.log(fileId);
    try {
      // Make the API call to create the file
      // const response = await fetch("/api/files", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     name: fileName,
      //     folder_id: selectedFolderId || null, // null means root folder
      //     content: "", // Assuming content is empty for now
      //     extension: extension,
      //   }),
      // });

      // const data = await response.json();
      const response = await axios.patch("/api/files", {
        id: selectedFileId,
        name: fileName,
        content: "", // Skip updating content
        extension: extension,
      });

      const data = response.data;
      console.log(response);
      if (response.status === 200) {
        dispatch(setFileName(""));
        dispatch(setRenameFileId(""));
        fetchFiles();
      }
    } catch (error: any) {
      console.error("Error creating file:", error.response.data.message);

      dispatch(
        setFileRenameError(
          error.response.data.message || "An error occured when creating the file"
        )
      );
    }

    dispatch(setRenameFileId(""));
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;
    dispatch(setFileName(input));

    // Allow only valid characters: letters, numbers, dots, hyphens, underscores
    const validNameRegex = /^[a-zA-Z0-9._-]+$/;
    console.log(selectedFileId);

    if (!input.trim()) {
      dispatch(setFileRenameError(""));
      return;
    } else if (!validNameRegex.test(input)) {
      dispatch(
        setFileRenameError("File name must not contain special characters or spaces.")
      );
      return;
    }

    const lastDotIndex = input.lastIndexOf(".");
    const extension = input.substring(lastDotIndex);
    const baseName = input.substring(0, lastDotIndex).trim();

    if (lastDotIndex === -1) {
      dispatch(
        setFileRenameError(
          "File extension is required (e.g., .js, .py, .ts, .cpp, .java)"
        )
      );
      return;
    }

    if (!baseName) {
      dispatch(setFileRenameError("Extension only is not allowed"));
      return;
    }

    if (!allowedLanguageExtensions.includes(extension)) {
      dispatch(
        setFileRenameError("Extension not allowed. Use .js, .py, .ts, .cpp, or .java")
      );
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
