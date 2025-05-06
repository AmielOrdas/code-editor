import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { setSelectedFolderId } from "@/lib/redux/slice";
import clsx from "clsx";
import { FolderDown } from "lucide-react";

type TFolder = {
  id: string;
  name: string;
  parent_id: string | null;
};

export default function FolderTree() {
  const dispatch = useDispatch();
  const folders = useSelector((state: RootState) => state.folder.folders);
  const selectedFolderId = useSelector(
    (state: RootState) => state.folder.selectedFolderId
  );

  function handleClick(folderId: string) {
    console.log("Clicked folderID", folderId);
    dispatch(setSelectedFolderId(folderId));
  }

  function renderTree(parentId: string | null = null, level: number = 0) {
    return folders
      .filter((folder: TFolder) => folder.parent_id === parentId)
      .map((folder: TFolder) => (
        <li key={folder.id} style={{ marginLeft: `${level === 0 ? 10 : level * 15}px` }}>
          <div
            className={clsx("text-white cursor-pointer flex items-center", {
              "bg-custom-gradient w-full": folder.id === selectedFolderId,
            })}
            onClick={(e) => {
              handleClick(folder.id);
            }}
          >
            <FolderDown className="text-white mr-2" />
            <span className="text-white">{folder.name}</span>
          </div>
          <ul>{renderTree(folder.id, level + 1)}</ul>
        </li>
      ));
  }

  return <div>{renderTree()}</div>;
}
