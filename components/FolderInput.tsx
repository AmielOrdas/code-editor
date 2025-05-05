"use client";

import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { RootState } from "@/lib/redux/store";
import {
  setFolderName,
  setFolderError,
  setIsFolderInputVisible,
} from "@/lib/redux/slice";

export default function FolderInput({
  handleAddFolder,
}: {
  handleAddFolder: () => void;
}) {
  const dispatch = useDispatch();
  const folderInputRef = useRef<HTMLInputElement>(null);

  const folderName = useSelector((state: RootState) => state.folder.name);
  const folderError = useSelector((state: RootState) => state.folder.error);
  const isFolderInputVisible = useSelector(
    (state: RootState) => state.folder.isInputVisible
  );

  function handleFolderInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    // const input = event.target.value;
    // dispatch(setFolderName(input));

    // const isValid = /^[a-zA-Z0-9_-]*$/.test(input); // only letters, numbers, hyphens, and underscores

    // if (!input.trim()) {
    //   dispatch(setFolderError("Folder name is required."));
    // } else if (!isValid) {
    //   dispatch(
    //     setFolderError(
    //       "Folder name can only contain letters, numbers, hyphens, and underscores."
    //     )
    //   );
    //   return;
    // } else {
    //   dispatch(setFolderError(""));
    // }

    const input = event.target.value;
    const isValid = /^[a-zA-Z0-9_-]*$/.test(input); // only letters, numbers, hyphens, and underscores are allowed.
    console.log(input);
    dispatch(setFolderName(input));
    console.log(folderError);
    if (!input.trim()) {
      dispatch(setFolderError(""));
      return;
    } else if (!isValid) {
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
  }

  function handleFolderKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !folderName.trim()) {
      dispatch(setFolderError(""));
      dispatch(setIsFolderInputVisible(false));
      return;
      // Add file if user press enter without any errors
    } else if (event.key === "Enter" && !folderError) {
      handleAddFolder(); // Create file when Enter key is pressed
    }
  }

  if (!isFolderInputVisible) return null;

  return (
    <div className="mt-4">
      <input
        type="text"
        autoFocus
        value={folderName}
        onChange={handleFolderInputChange}
        onBlur={handleFolderBlur}
        onKeyDown={handleFolderKeyDown}
        placeholder="Enter folder name"
        className={clsx("w-full bg-[#121212] text-orangeCustom border-2", {
          "border-red-500": folderError,
          "border-white": !folderError,
        })}
        ref={folderInputRef}
      />
      <p className="text-red-500 text-sm mt-2">{folderError}</p>
    </div>
  );
}
