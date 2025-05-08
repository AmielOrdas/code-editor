import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { setSelectedFolderId } from "@/lib/redux/slice";

import FolderInput from "./FolderInput";
import FileInput from "./FileInput";
import Files from "./Files";
import Folders from "./Folders";

export default function FolderTree({
  buttonsRef,
}: {
  buttonsRef: React.RefObject<HTMLDivElement | null>;
}) {
  const dispatch = useDispatch();

  const selectedFolderId = useSelector(
    (state: RootState) => state.folder.selectedFolderId
  );

  const treeRef = useRef<HTMLDivElement>(null);

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
