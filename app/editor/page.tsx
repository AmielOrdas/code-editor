"use client";
import CodeEditor from "@/components/CodeEditor";
import AnimationWrapper from "@/components/wrappers/PageAnimation";
import ProgLanguageSelector from "@/components/ProgLanguageSelector";
import {
  setSideBarWidth,
  setEditorHeight,
  setLanguage,
  setRightSideWidth,
} from "@/lib/redux/slice";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import NavbarEditor from "@/components/NavbarEditor";

export default function ResizableLayout() {
  // const [sidebarWidth, setSideBarWidth] = useState(300); // px
  // const [topHeight, setTopHeight] = useState(700); // px

  // const [rightSideWidth, setRightSideWidth] = useState<number>(0); // New state for right-side width

  const editorHeight = useSelector((state: RootState) => state.editorHeight.value);
  const sideBarWidth = useSelector((state: RootState) => state.sideBarWidth.value);
  const rightSideWidth = useSelector((state: RootState) => state.rightSideWidth.value);
  const language = useSelector((state: RootState) => state.language.value);
  const output = useSelector((state: RootState) => state.runData.value);
  const dispatch = useDispatch();

  const [isFileInputVisible, setIsFileInputVisible] = useState(false);
  const [fileName, setFileName] = useState(""); // State for file name input
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input element

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value); // Update the file name as user types
  };

  async function handleAddFile() {
    // You can add extension validation later
    if (!fileName.trim()) {
      setIsFileInputVisible(false);
      return;
    }

    // try {
    //   // Make the API call to create the file
    //   const response = await fetch("/api/files", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       name: fileName,
    //       folder_id: "some-folder-id", // You can pass the actual folder ID here
    //       content: "", // Assuming content is empty for now
    //     }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     alert("File created successfully");
    //     setFileName(""); // Clear the input
    //     setIsFileInputVisible(false); // Hide the input field after successful creation
    //   } else {
    //     alert(data.message || "Error creating file");
    //   }
    // } catch (error) {
    //   console.error("Error creating file:", error);
    //   alert("An error occurred while creating the file.");
    // }
    setIsFileInputVisible(false);
  }
  function handleBlur() {
    // If the input loses focus, create the file if fileName is not empty
    handleAddFile();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleAddFile(); // Create file when Enter key is pressed
    }
  }
  useEffect(() => {
    dispatch(setRightSideWidth(window.innerWidth - sideBarWidth));
  }, [sideBarWidth]);

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
          <NavbarEditor setIsFileInputVisible={setIsFileInputVisible} />
          {/* Show the input field when FilePlus is clicked */}
          {isFileInputVisible && (
            <div className="mt-4">
              <input
                type="text"
                autoFocus
                value={fileName}
                onChange={handleFileInputChange}
                onBlur={handleBlur} // Call handleBlur when input loses focus
                onKeyDown={handleKeyDown} // Call handleAddFile when Enter is pressed
                placeholder="Enter file name (e.g., file.cpp)"
                className="w-full p-2 border rounded bg-white"
                ref={inputRef}
              />
            </div>
          )}
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
            <ProgLanguageSelector />
            <h1 className="text-white whitespace-pre-wrap break-words p-2">
              {output || "Click run code to see output"}
            </h1>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}
