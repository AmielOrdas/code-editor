import { useSelector, useDispatch } from "react-redux";
import {
  setExpandedFolders,
  setRenameFolderId,
  setSelectedFileId,
  setSelectedFolderId,
} from "@/lib/redux/slice"; // Assuming you have a slice for this
import { ChevronDown, ChevronRight, FolderDown } from "lucide-react";
import clsx from "clsx";
import FolderInput from "./FolderInput";

import { RootState } from "@/lib/redux/store";

import RenameFolderInput from "./RenameFolderInput";
import FileInput from "./FileInput";
import { TFolder } from "@/lib/Types&Constants";
import { deleteSchema } from "@/lib/zod";
import axios, { isAxiosError } from "axios";
import { fetchFolders } from "@/lib/functions";

export default function Folders({
  parentId,
  level,
  renderTree,
}: {
  parentId: string | null;
  level: number;
  renderTree: (parentId: string | null, level: number) => React.ReactNode;
}) {
  const folders = useSelector((state: RootState) => state.folder.folders);
  const selectedFolderId = useSelector(
    (state: RootState) => state.folder.selectedFolderId
  ); // Get selected folder ID
  const nestedFolders = folders.filter((f: TFolder) => f.parent_id === parentId);
  const expandedFolders = new Set(
    useSelector((state: RootState) => state.folder.expandedFolders)
  );
  const FolderRenameError = useSelector((state: RootState) => state.folder.renameError);

  const renameFolderId = useSelector((state: RootState) => state.folder.renameFolderId);

  const dispatch = useDispatch();

  function handleFolderOnDoubleClick(folderId: string) {
    dispatch(setRenameFolderId(folderId));
    dispatch(setSelectedFileId(""));
  }

  function handleToggleFolder(folderId: string) {
    dispatch(setSelectedFolderId(folderId));
    dispatch(setSelectedFileId(""));

    if (expandedFolders.has(folderId)) {
      // If the folderId (clicked folder) is inside the expandedFolders set then that means we must delete to collapse.
      expandedFolders.delete(folderId);
    } else {
      // If the folderId (clicked folder) is not inside the expandedFolders set then that means we must add it to expand.
      expandedFolders.add(folderId);
    }

    dispatch(setExpandedFolders(Array.from(expandedFolders))); // Convert to array from set for Redux
  }

  async function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Delete" || event.key === "Del") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this folder?"
      );
      if (!confirmDelete) return;

      const parsed = deleteSchema.safeParse({ id: selectedFolderId });

      if (!parsed.success) {
        const errorMessage = parsed.error.errors[0]?.message || "Invalid folder ID";
        alert(errorMessage);
        return;
      }

      try {
        const response = await axios.delete("/api/folders", {
          data: { id: selectedFolderId },
        });

        if (response.status === 200) {
          await fetchFolders(dispatch); // reload file list
        }
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          // If it's an Axios error, safely access the message
          const message = error?.response?.data?.message || "Error deleting folder";
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
      {nestedFolders.map((folder: TFolder) => (
        <ul key={folder.id} style={{ marginLeft: `${level === 0 ? 0 : level * 15}px` }}>
          {/*
          level = 0 means that folder is the main folder meaning we have ml = 0.
          If we have a level then we have ml=15
          */}
          <div
            className={clsx("text-white cursor-pointer flex items-center", {
              "bg-custom-gradient w-full": folder.id === selectedFolderId,
            })}
            tabIndex={0}
            onClick={() => handleToggleFolder(folder.id)}
            onDoubleClick={() => handleFolderOnDoubleClick(folder.id)}
            onKeyDown={handleKeyDown}
          >
            {expandedFolders.has(folder.id) ? (
              <ChevronDown className="text-white mr-1" />
            ) : (
              <ChevronRight className="text-white mr-1" />
            )}
            <FolderDown className="text-white mr-2" />
            {renameFolderId === folder.id ? (
              <RenameFolderInput />
            ) : (
              <span className="text-white">{folder.name}</span>
            )}
          </div>
          {renameFolderId === folder.id && FolderRenameError && (
            <p className="text-red-500 text-sm ml-1 mb-2">{FolderRenameError}</p>
          )}
          {/* <ul>{renderTree(folder.id, level + 1)}</ul> */}
          {expandedFolders.has(folder.id) && <ul>{renderTree(folder.id, level + 1)}</ul>}

          {selectedFolderId === folder.id && (
            <li style={{ marginLeft: `${level === 0 ? 20 : (level + 1) * 15}px` }}>
              {/*
              When adding a subfolder or subfile on an existing folder, this means input must be level 1 deeper which is why we have (level + 1). 
              
              We add extra 30px to accommodate with the extra icons  <ChevronRight className="text-white mr-1" /> and <FolderDown className="text-white mr-2" />

              When the selected folder is level = 0 meaning its the root folder then the margin left is 20 here: marginLeft: `${level === 0 ? 20. However, its added by 30 as well because of this: <div className="ml-[30px]"> which means the total is 50.

              This is because its 50 in the FolderTree.tsx: <div className="ml-[50px]">
              */}
              <div className="ml-[30px]">
                <FolderInput />
              </div>
              <div className="ml-[30px]">
                <FileInput />
              </div>
            </li>
          )}
        </ul>
      ))}
    </>
  );
}
