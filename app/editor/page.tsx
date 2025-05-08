"use client";
import CodeEditor from "@/components/Code Editor/Code Editor Area/CodeEditor";
import AnimationWrapper from "@/components/wrappers/PageAnimation";
import OutputArea from "@/components/Code Editor/Output Area/OutputArea";
import {
  setSideBarWidth,
  setEditorHeight,
  setRightSideWidth,
  setLanguages,
} from "@/lib/redux/slice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import NavbarEditor from "@/components/Code Editor/SideBar Area/NavbarEditor";
import FolderTree from "@/components/Code Editor/SideBar Area/FolderTree";
import { fetchFiles, fetchFolders } from "@/lib/functions";
import axios from "axios";

export default function ResizableLayout() {
  // States needed in adjusting the sizes of sidebar, editor part and the output part
  const editorHeight = useSelector((state: RootState) => state.editorHeight.value);
  const sideBarWidth = useSelector((state: RootState) => state.sideBarWidth.value);
  const rightSideWidth = useSelector((state: RootState) => state.rightSideWidth.value);

  // States needed in output area
  const output = useSelector((state: RootState) => state.runData.value);

  // States needed to detect selectedFileId
  const selectedFileId = useSelector((state: RootState) => state.file.selectedFileId);

  const buttonsRef = useRef<HTMLInputElement>(null);
  const isMainFile = selectedFileId === process.env.NEXT_PUBLIC_WELCOME_FILE_ID;

  const dispatch = useDispatch();

  async function getLanguages() {
    const { data } = await axios.get("/api/languages");
    dispatch(setLanguages(data));
  }

  // Fetch folders, files, and languages when the component mounts
  useEffect(() => {
    fetchFolders(dispatch);
    fetchFiles(dispatch);
    getLanguages();
  }, [dispatch]); // Empty dependency array to call fetchFolders only once on mount

  // Calculates the width of the right side area (editor and output area) everytime the sideBarWidth changes when user uses the vertical resizer.
  useEffect(() => {
    dispatch(setRightSideWidth(window.innerWidth - sideBarWidth));
  }, [sideBarWidth, dispatch]);

  function onSideBarResize(e: MouseEvent) {
    if (e.clientX > 100) {
      dispatch(setSideBarWidth(e.clientX));
    } else {
      dispatch(setSideBarWidth(0));
    }
  }

  function onBottomBarResize(e: MouseEvent) {
    dispatch(setEditorHeight(e.clientY));
  }

  function onMouseUp() {
    window.removeEventListener("mousemove", onSideBarResize);
    window.removeEventListener("mousemove", onBottomBarResize);
    window.removeEventListener("mouseup", onMouseUp);
  }

  function handleSidebarResize(e: React.MouseEvent) {
    e.preventDefault();

    window.addEventListener("mousemove", onSideBarResize);
    window.addEventListener("mouseup", onMouseUp);
  }

  function handleHorizontalResize(e: React.MouseEvent) {
    e.preventDefault();

    window.addEventListener("mousemove", onBottomBarResize);
    window.addEventListener("mouseup", onMouseUp);
  }

  return (
    <AnimationWrapper>
      <div className="flex h-screen w-screen bg-[#121212]">
        {/* Sidebar */}
        <div
          className="h-screen overflow-y-auto max-w-[500px] custom-scroll"
          style={{ width: `${sideBarWidth}px` }}
        >
          <NavbarEditor buttonsRef={buttonsRef} />

          <FolderTree buttonsRef={buttonsRef} />
        </div>

        {/* Draggable vertical resizer */}
        <div
          onMouseDown={handleSidebarResize}
          className="cursor-col-resize bg-gray-400 transition-colors hover:bg-gray-300 w-[4px]"
        />

        {/* Right side (top + bottom) */}
        <div
          className="flex flex-col flex-grow  "
          style={{ width: `${rightSideWidth}px` }}
        >
          {/* Top Section */}
          <div className="min-h-[200px]" style={{ height: `${editorHeight}px` }}>
            <CodeEditor />
          </div>

          {/* Draggable horizontal resizer */}
          <div
            onMouseDown={handleHorizontalResize}
            className="cursor-row-resize bg-white h-[4px]"
          />

          {/* Bottom Section */}
          <div className="flex flex-col overflow-y-auto max-h-[300px] custom-scroll">
            <OutputArea />
            <h1 className="text-white whitespace-pre-wrap break-words p-2">
              {output ||
                (isMainFile ? (
                  <p className="text-red-500">
                    welcome.py is not allowed for code execution
                  </p>
                ) : selectedFileId ? (
                  "Click run code to see the output"
                ) : (
                  "No File selected"
                ))}
            </h1>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}
