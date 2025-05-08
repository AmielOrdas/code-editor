"use client";

import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { RootState } from "@/lib/redux/store";
import {
  setFolderName,
  setFolderRenameError,
  setIsFolderRenameInputSubmitting,
  setRenameFolderId,
} from "@/lib/redux/slice";
import axios from "axios";
import { renameFolderSchema } from "@/lib/zod";
import { fetchFolders } from "@/lib/functions";

export default function RenameFolderInput() {
  const folderName = useSelector((state: RootState) => state.folder.name);

  const selectedFolderId = useSelector(
    (state: RootState) => state.folder.selectedFolderId
  );
  const error = useSelector((state: RootState) => state.folder.renameError);
  const isSubmitting = useSelector(
    (state: RootState) => state.folder.isRenameInputSubmitting
  );

  const dispatch = useDispatch();

  async function handleRenameFolder(name: string) {
    if (isSubmitting) return; // Prevent multiple submissions

    const result = renameFolderSchema.safeParse({
      id: selectedFolderId,
      name: name,
    });

    if (!result.success) {
      dispatch(setFolderRenameError(result.error.errors[0].message));
      dispatch(setIsFolderRenameInputSubmitting(false));
      return;
    }

    dispatch(setIsFolderRenameInputSubmitting(true));

    try {
      const response = await axios.patch("api/folders", {
        id: selectedFolderId,
        name: folderName,
      });

      if (response.status === 200) {
        dispatch(setFolderName("")); // Clear the folder input
        dispatch(setRenameFolderId("")); // Hide the folder input field after successful creation

        fetchFolders(dispatch); // Refetch the folders to show in the sidebar
      }
    } catch (error: any) {
      console.error("Error creating folder:", error);
      dispatch(
        setFolderRenameError(
          error.response.data.message || "An error occurred while creating the folder."
        )
      );
    }
    dispatch(setFolderName("")); // Clear the folder input

    dispatch(setIsFolderRenameInputSubmitting(false));
  }

  function handleFolderInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;

    dispatch(setFolderName(input));
    // Validate using Zod
    const result = renameFolderSchema.safeParse({
      id: selectedFolderId,
      name: input,
    });

    if (!input.trim()) {
      dispatch(setFolderRenameError(""));
      return;
    } else if (!result.success) {
      dispatch(setFolderRenameError(result.error.errors[0].message));
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
