"use client";

import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { RootState } from "@/lib/redux/store";
import {
  setFolderName,
  setFolderError,
  setIsFolderInputVisible,
  setIsFolderInputSubmitting,
} from "@/lib/redux/slice";
import axios, { isAxiosError } from "axios";
import { fetchFolders } from "@/lib/functions";
import { createFolderSchema } from "@/lib/zod";

export default function FolderInput() {
  const dispatch = useDispatch();
  const folderInputRef = useRef<HTMLInputElement>(null);

  const folderName = useSelector((state: RootState) => state.folder.name);
  const folderError = useSelector((state: RootState) => state.folder.error);
  const isFolderInputVisible = useSelector(
    (state: RootState) => state.folder.isInputVisible
  );
  const selectedFolderId = useSelector(
    (state: RootState) => state.folder.selectedFolderId
  ); // Get selected folder ID

  const isSubmitting = useSelector((state: RootState) => state.folder.isSubmitting);

  async function handleAddFolder(name: string, parentId: string | null) {
    if (isSubmitting) return; // Prevent multiple submissions

    // Validate folder name using Zod schema
    const result = createFolderSchema.safeParse({
      name: name,
      parent_id: parentId,
    });

    if (!result.success) {
      // If validation fails, set the error and prevent submission
      dispatch(setFolderError(result.error.errors[0].message));
      return;
    }
    dispatch(setIsFolderInputSubmitting(true));

    try {
      const response = await axios.post("api/folders", {
        name: name,
        parent_id: parentId || null,
      });

      if (response.status === 201) {
        dispatch(setFolderName("")); // Clear the folder input
        dispatch(setIsFolderInputVisible(false)); // Hide the folder
        fetchFolders(dispatch); // Refetch the folders to show in the sidebar
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        // If it's an Axios error, safely access the message
        console.error("Error creating folder:", error?.response?.data.message);

        dispatch(
          setFolderError(
            error?.response?.data.message ||
              "An error occurred while creating the folder."
          )
        );
      } else {
        // If it's not an Axios error, handle it differently
        console.error("Unknown error occurred:", error);
        dispatch(setFolderError("An unexpected error occurred"));
      }
    }

    dispatch(setIsFolderInputSubmitting(false));
  }

  function handleFolderInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;
    dispatch(setFolderName(input));

    // Use Zod's safeParse to validate
    const result = createFolderSchema.safeParse({
      name: input,
      parent_id: selectedFolderId,
    });

    if (!input.trim()) {
      dispatch(setFolderError(""));
      return;
    } else if (!result.success) {
      dispatch(
        setFolderError(
          "Folder name can only contain letters, numbers, dots, hyphens, and underscores."
        )
      );
      return;
    }
    dispatch(setFolderError("")); // clear error if input is valid
  }

  function handleFolderBlur() {
    if (folderError || !folderName.trim()) {
      dispatch(setFolderError(""));
      dispatch(setFolderName(""));
      dispatch(setIsFolderInputVisible(false));
      return;
    }
    handleAddFolder(folderName, selectedFolderId);
  }

  function handleFolderKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !folderName.trim()) {
      dispatch(setFolderError(""));
      dispatch(setIsFolderInputVisible(false));
      return;
      // Add file if user press enter without any errors
    } else if (event.key === "Enter" && !folderError) {
      handleAddFolder(folderName, selectedFolderId); // Create file when Enter key is pressed
    }
  }

  if (!isFolderInputVisible) return null;

  return (
    <div>
      <input
        type="text"
        autoFocus
        value={folderName}
        onChange={handleFolderInputChange}
        onBlur={handleFolderBlur}
        onKeyDown={handleFolderKeyDown}
        placeholder="Enter folder name"
        className={clsx("w-full bg-[#121212] text-orangeCustom", {
          "border-red-500": folderError,
          "border-white": !folderError,
        })}
        ref={folderInputRef}
      />
      <p className="text-red-500 text-sm mt-2">{folderError}</p>
    </div>
  );
}
