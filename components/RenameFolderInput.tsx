"use client";

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { RootState } from "@/lib/redux/store";
import {
  setFolderName,
  setFolderRenameError,
  setFolders,
  setIsFolderRenameInputSubmitting,
  setRenameFolderId,
} from "@/lib/redux/slice";
import axios from "axios";

export default function RenameFolderInput({ folderId }: { folderId?: string }) {
  const folderName = useSelector((state: RootState) => state.folder.name);

  const selectedFolderId = useSelector(
    (state: RootState) => state.folder.selectedFolderId
  );
  const error = useSelector((state: RootState) => state.folder.renameError);
  const isSubmitting = useSelector(
    (state: RootState) => state.folder.isRenameInputSubmitting
  );

  const dispatch = useDispatch();

  async function fetchFolders() {
    try {
      const response = await fetch("/api/folders");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch folders");
      }

      const data = await response.json();
      dispatch(setFolders(data.folders)); // Assuming you have state for storing folders
    } catch (error) {
      console.error("Error fetching folders:", error);
      dispatch(setFolders([])); // Clear folders in case of error
    }
  }

  async function handleRenameFolder(name: string) {
    if (isSubmitting) return; // Prevent multiple submissions

    dispatch(setIsFolderRenameInputSubmitting(true));

    try {
      // Make the API call to create the folder
      // const response = await fetch("/api/folders", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     name: name,
      //     parent_id: parentId || null,
      //   }),
      // });

      const response = await axios.patch("api/folders", {
        id: selectedFolderId,
        name: folderName,
      });
      const data = response.data;
      if (response.status === 200) {
        dispatch(setFolderName("")); // Clear the folder input
        dispatch(setRenameFolderId("")); // Hide the folder input field after successful creation

        fetchFolders(); // Refetch the folders to show in the sidebar
      }
    } catch (error: any) {
      console.error("Error creating folder:", error);
      dispatch(
        setFolderRenameError(
          error.response.data.message || "An error occurred while creating the folder."
        )
      );
      // dispatch(setSubFolderError("An error occurred while creating the folder."));
    }
    dispatch(setFolderName("")); // Clear the folder input

    dispatch(setIsFolderRenameInputSubmitting(false));
  }

  function handleFolderInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    // const input = event.target.value;
    // dispatch(setFolderName(input));

    // const isValid = /^[a-zA-Z0-9_-]*$/.test(input); // only letters, numbers, hyphens, and underscores

    // if (!input.trim()) {
    //   dispatch(setFolderRenameError("Folder name is required."));
    // } else if (!isValid) {
    //   dispatch(
    //     setFolderRenameError(
    //       "Folder name can only contain letters, numbers, hyphens, and underscores."
    //     )
    //   );
    //   return;
    // } else {
    //   dispatch(setFolderRenameError(""));
    // }

    const input = event.target.value;
    const isValid = /^[a-zA-Z0-9_-]*$/.test(input); // only letters, numbers, hyphens, and underscores are allowed.
    console.log(input);
    dispatch(setFolderName(input));

    if (!input.trim()) {
      dispatch(setFolderRenameError(""));
      return;
    } else if (!isValid) {
      dispatch(
        setFolderRenameError(
          "Folder name can only contain letters, numbers, dots, hyphens, and underscores."
        )
      );
      return;
    }
    dispatch(setFolderRenameError("")); // clear error if input is valid
  }

  function handleFolderBlur() {
    if (error || !folderName.trim()) {
      dispatch(setFolderRenameError(""));
      dispatch(setFolderName(""));
      dispatch(setRenameFolderId(""));
      return;
    }
    handleRenameFolder(folderName);
  }

  function handleFolderKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !folderName.trim()) {
      dispatch(setFolderRenameError(""));
      dispatch(setRenameFolderId(""));
      return;
      // Add file if user press enter without any errors
    } else if (event.key === "Enter" && !error) {
      handleRenameFolder(folderName); // Create file when Enter key is pressed
    }
  }

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
        className={clsx("w-full bg-[#121212] text-orangeCustom border", {
          "border-red-500": error,
          "border-white": !error,
          "opacity-50 cursor-not-allowed": isSubmitting,
        })}
      />
    </div>
  );
}
