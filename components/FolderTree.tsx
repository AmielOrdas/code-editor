import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  setSelectedFolderId,
  setIsFileInputVisible,
  setSelectedFileId,
  setRenameFileId,
  setRenameFolderId,
  setExpandedFolders,
} from "@/lib/redux/slice";
import clsx from "clsx";
import { ChevronDown, ChevronRight, FileText, FolderDown } from "lucide-react";
import RenameFileInput from "./RenameFileInput";
import RenameFolderInput from "./RenameFolderInput";
import FolderInput from "./FolderInput";
import FileInput from "./FileInput";
import Files from "./Files";
import Folders from "./Folders";

type TFolder = {
  id: string;
  name: string;
  parent_id: string | null;
};

type TFile = {
  id: string;
  name: string;
  folder_id: string | null;
};

export default function FolderTree({
  buttonsRef,
}: {
  buttonsRef: React.RefObject<HTMLDivElement | null>;
}) {
  const dispatch = useDispatch();
  const folders = useSelector((state: RootState) => state.folder.folders);
  const isFolderInputVisible = useSelector(
    (state: RootState) => state.folder.isInputVisible
  );

  const files = useSelector((state: RootState) => state.file.files);
  const selectedFolderId = useSelector(
    (state: RootState) => state.folder.selectedFolderId
  );
  const expandedFolders = new Set(
    useSelector((state: RootState) => state.folder.expandedFolders)
  );
  console.log(expandedFolders);
  const selectedFileId = useSelector((state: RootState) => state.file.selectedFileId);
  const FileRenameError = useSelector((state: RootState) => state.file.renameError);
  const renameFileId = useSelector((state: RootState) => state.file.renameFileId);

  const renameFolderId = useSelector((state: RootState) => state.folder.renameFolderId);
  const FolderRenameError = useSelector((state: RootState) => state.folder.renameError);
  const treeRef = useRef<HTMLDivElement>(null);

  // function handleFolderClick(folderId: string) {
  //   dispatch(setSelectedFolderId(folderId));
  //   dispatch(setSelectedFileId(""));
  // }

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

  function handleFileClick(fileId: string) {
    dispatch(setSelectedFileId(fileId));
    dispatch(setSelectedFolderId(""));
  }

  function handleFileOnDoubleClick(fileId: string) {
    dispatch(setRenameFileId(fileId));
    dispatch(setSelectedFolderId(""));
  }

  function handleFolderOnDoubleClick(folderId: string) {
    dispatch(setRenameFolderId(folderId));
    dispatch(setSelectedFileId(""));
  }

  function handleClickOutside(event: MouseEvent) {
    if (buttonsRef.current?.contains(event.target as Node)) {
      return;
    }

    if (treeRef.current && !treeRef.current.contains(event.target as Node)) {
      dispatch(setSelectedFolderId(""));
    }
  }

  useEffect(function setupClickOutsideReset() {
    document.addEventListener("mousedown", handleClickOutside);
    return function cleanup() {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const isCreatingInMainFolder = !selectedFolderId;

  function renderTree(parentId: string | null = null, level: number = 0) {
    const nestedFolders = folders.filter((f: TFolder) => f.parent_id === parentId);
    const nestedFiles = files.filter((f: TFile) => f.folder_id === parentId);

    return (
      <>
        <Folders parentId={parentId} level={level} renderTree={renderTree} />
        <Files parentId={parentId} level={level} />
      </>
    );
  }

  return (
    <div ref={treeRef}>
      {renderTree()}
      {isCreatingInMainFolder && (
        <div className="ml-[50px]">
          <FolderInput />
        </div>
      )}

      {isCreatingInMainFolder && (
        <div className="ml-[50px]">
          <FileInput />
        </div>
      )}
    </div>
  );
}
// <RenameFileInput currentName={file.name} />

/*
{nestedFolders.map((folder: TFolder) => (
          <ul
            key={folder.id}
            style={{ marginLeft: `${level === 0 ? 10 : level * 15}px` }}
          >
            <div
              className={clsx("text-white cursor-pointer flex items-center", {
                "bg-custom-gradient w-full": folder.id === selectedFolderId,
              })}
              onClick={() => handleToggleFolder(folder.id)}
              onDoubleClick={() => handleFolderOnDoubleClick(folder.id)}
            >
              {expandedFolders.has(folder.id) ? (
                <ChevronDown className="text-white mr-1" />
              ) : (
                <ChevronRight className="text-white mr-1" />
              )}
              <FolderDown className="text-white mr-2" />
              {renameFolderId === folder.id ? (
                <RenameFolderInput folderId={folder.id} />
              ) : (
                <span className="text-white">{folder.name}</span>
              )}
            </div>

            {renameFolderId === folder.id && FolderRenameError && (
              <p className="text-red-500 text-sm ml-1 mb-2">{FolderRenameError}</p>
            )}
            //{/* <ul>{renderTree(folder.id, level + 1)}</ul> */
//     {expandedFolders.has(folder.id) && (
//       <ul>{renderTree(folder.id, level + 1)}</ul>
//     )}
//     {selectedFolderId === folder.id && (
//       <div className="ml-[20px]">
//         <FolderInput />
//         <FileInput />
//       </div>
//     )}
//   </ul>
// ))} */

{
  /* {nestedFiles.map((file: TFile) => (
          <ul
          
            key={file.id}
            style={{ marginLeft: `${level === 0 ? 10 : level * 15}px` }}
            className="text-white"
          >
            <div
              className={clsx("text-white cursor-pointer flex items-center ml-7", {
                "bg-custom-gradient w-full": file.id === selectedFileId,
              })}
              onClick={() => handleFileClick(file.id)}
              onDoubleClick={() => handleFileOnDoubleClick(file.id)}
            >
              <FileText className="text-white mr-2" />

              {renameFileId === file.id ? (
                <RenameFileInput fileId={file.id} />
              ) : (
                <span className="text-white">{file.name}</span>
              )}
            </div>
            {renameFileId === file.id && FileRenameError && (
              <p className="text-red-500 text-sm ml-1 mb-2">{FileRenameError}</p>
            )}
          </ul>
        ))} */
}
