import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedFolderId } from "@/lib/redux/slice"; // Assuming you have a slice for this
import { FolderDown } from "lucide-react";
import clsx from "clsx";
import FolderInput from "./FolderInput";
import SubFolderInput from "./SubFolderInput";
import { RootState } from "@/lib/redux/store";
import FolderTree from "./FolderTree";
type TFolder = {
  id: string;
  name: string;
};

export default function Folders({
  handleAddFolder,
}: {
  handleAddFolder: (name: string, parentId: string | null) => void;
}) {
  const folders = useSelector((state: RootState) => state.folder.folders);
  const selectedFolderId = useSelector(
    (state: RootState) => state.folder.selectedFolderId
  ); // Get selected folder ID
  const isSubFolderInputVisible = useSelector(
    (state: RootState) => state.subFolder.isSubFolderInputVisible
  ); // Get visibility from Redux
  const subFolderParentId = useSelector((state: RootState) => state.subFolder.parentId); // Get parent ID from Redux (for subfolder)
  const buttonsRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const folderListRef = useRef<HTMLDivElement>(null); // Ref for the folder list container

  // function handleFolderClick(folderId: string) {
  //   // Dispatch action to set the selected folder in Redux
  //   dispatch(setSelectedFolderId(folderId));
  // }
  console.log("selectedFolderId", selectedFolderId);
  console.log("subFolderParentId", subFolderParentId);
  function handleClickOutside(event: MouseEvent) {
    // checking if folder list ref exists and checking the ref if it contains the mouse event that happened.
    // if (folderListRef.current && !folderListRef.current.contains(event.target as Node)) {
    //   console.log("Lose focus");
    //   dispatch(setSelectedFolderId("")); // Deselect folder when clicking outside
    // }
    if (
      folderListRef.current &&
      !folderListRef.current.contains(event.target as Node) &&
      buttonsRef.current &&
      !buttonsRef.current.contains(event.target as Node)
    ) {
      console.log("Lose focus");
      dispatch(setSelectedFolderId(""));
    }
  }
  console.log(isSubFolderInputVisible);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={folderListRef}>
      <FolderTree />

      {/* {folders.length > 0 ? (
        <ul>
          {folders.map((folder: TFolder) => (
            <div
              className={clsx(
                "text-white cursor-pointer flex space-x-1 ml-2", // Base classes
                {
                  "bg-custom-gradient w-full": folder.id === selectedFolderId, // Apply bg-custom-gradient if folder is selected
                }
              )}
              onClick={() => handleFolderClick(folder.id)}
              key={folder.id}
            >
              <FolderDown className="text-white" />
              <li
                className="text-white cursor-pointer" // Base classes
              >
                {folder.name}
              </li>
            </div>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No folders available</p>
      )} */}
      {isSubFolderInputVisible && selectedFolderId && (
        <SubFolderInput
          parentId={selectedFolderId} // Pass the selected folder as parentId
          handleAddFolder={handleAddFolder} // Pass handleAddFolder function to SubFolderInput
        />
      )}
    </div>
  );
}
