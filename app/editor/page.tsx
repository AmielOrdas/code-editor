"use client";
import CodeEditor from "@/components/CodeEditor";
import AnimationWrapper from "@/components/wrappers/PageAnimation";
import ProgLanguageSelector from "@/components/ProgLanguageSelector";
import {
  setSideBarWidth,
  setEditorHeight,
  setLanguage,
  setRightSideWidth,
  setFolderError,
  setFolderName,
  setFolders,
  setIsFolderInputVisible,
  setIsFolderInputSubmitting,
  setFileError,
  setFileName,
  setFiles,
  setIsFileInputVisible,
  setIsFileInputSubmitting,
} from "@/lib/redux/slice";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import NavbarEditor from "@/components/NavbarEditor";
import Files from "@/components/Files";
import FilesInput from "@/components/FileInput";
import FoldersInput from "@/components/FolderInput";
import Folders from "@/components/Folders";

export default function ResizableLayout() {
  // const [sidebarWidth, setSideBarWidth] = useState(300); // px
  // const [topHeight, setTopHeight] = useState(700); // px

  // const [rightSideWidth, setRightSideWidth] = useState<number>(0); // New state for right-side width

  type TFolders = {
    id: string;
    name: string;
  };
  // States needed in adjusting the sizes of sidebar, editor part and the output part
  const editorHeight = useSelector((state: RootState) => state.editorHeight.value);
  const sideBarWidth = useSelector((state: RootState) => state.sideBarWidth.value);
  const rightSideWidth = useSelector((state: RootState) => state.rightSideWidth.value);

  // States needed in output area
  const language = useSelector((state: RootState) => state.language.value);
  const output = useSelector((state: RootState) => state.runData.value);
  const languages = useSelector((state: RootState) => state.languages.value);

  // States needed in code area
  const code = useSelector((state: RootState) => state.code.value);

  // States needed for folder
  const folderName = useSelector((state: RootState) => state.folder.name);
  const folderError = useSelector((state: RootState) => state.folder.error);
  const isFolderInputVisible = useSelector(
    (state: RootState) => state.folder.isInputVisible
  );
  const folders = useSelector((state: RootState) => state.folder.folders);

  // States needed for files
  const fileName = useSelector((state: RootState) => state.file.name);
  const error = useSelector((state: RootState) => state.file.error);
  const isSubmitting = useSelector((state: RootState) => state.file.isSubmitting);
  const isFileInputVisible = useSelector((state: RootState) => state.file.isInputVisible);
  const files = useSelector((state: RootState) => state.file.files);
  const dispatch = useDispatch();

  // const [files, setFiles] = useState<TFiles[] | []>([]);

  const inputFileRef = useRef<HTMLInputElement>(null); // Ref for the input element

  // const [folderName, setFolderName] = useState("");
  // const [folders, setFolders] = useState<TFolders[] | []>([]);
  // const [isFolderInputVisible, setIsFolderInputVisible] = useState(false);
  // const folderInputRef = useRef<HTMLInputElement>(null);
  // const [folderError, setFolderError] = useState("");

  const allowedLanguageExtensions = [".js", ".py", ".ts", ".cpp", ".java"];
  // function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   const input = event.target.value;
  //   setFileName(input);
  //   // Allow only valid characters: letters, numbers, dots, hyphens, underscores
  //   const validNameRegex = /^[a-zA-Z0-9._-]+$/;

  //   if (!input.trim()) {
  //     setError("");
  //     return;
  //   } else if (!validNameRegex.test(input)) {
  //     setError("File name must not contain special characters or spaces.");
  //     return;
  //   }

  //   const lastDotIndex = input.lastIndexOf(".");
  //   const extension = input.substring(lastDotIndex);
  //   const baseName = input.substring(0, lastDotIndex).trim();

  //   if (lastDotIndex === -1) {
  //     setError("File extension is required (e.g., .js, .py, .ts, .cpp, .java)");
  //     return;
  //   } else if (!baseName) {
  //     setError("");
  //     return;
  //   } else if (!allowedLanguageExtensions.includes(extension)) {
  //     setError("Extension not allowed. Use .js, .py, .ts, .cpp, or .java");
  //     return;
  //   }

  //   setError("");
  // }

  async function fetchFiles() {
    try {
      const response = await fetch("/api/files");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch files");
      }

      const { files } = await response.json();
      dispatch(setFiles(files));
    } catch (error) {
      console.error("Error fetching files:", error);
      dispatch(setFiles([])); // Clear the files in case of an error
    }
  }

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

  async function handleAddFolder() {
    if (isSubmitting) return; // Prevent multiple submissions

    dispatch(setIsFolderInputSubmitting(true));

    try {
      // Make the API call to create the folder
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: folderName,
          parent_id: null, // Pass the parent folder ID if you have one
        }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setFolderName("")); // Clear the input
        dispatch(setIsFolderInputVisible(false)); // Hide the input field after successful creation
        fetchFolders(); // Refetch the folders to show in the sidebar
      } else {
        dispatch(setFolderError(data.message || "Error creating folder"));
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      dispatch(setFolderError("An error occurred while creating the folder."));
    }

    dispatch(setIsFolderInputSubmitting(false));
  }

  async function handleAddFile() {
    // You can add extension validation later
    console.log("File added!");

    const extension = fileName.substring(fileName.lastIndexOf(".") + 1); // Get the extension

    try {
      // Make the API call to create the file
      const response = await fetch("/api/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fileName,
          folder_id: null, // You can pass the actual folder ID here
          content: "", // Assuming content is empty for now
          extension: extension,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setFileName(""));
        dispatch(setIsFileInputVisible(false));
        fetchFiles();
      } else {
        dispatch(
          setFileError(data.message || "An error occurred while creating the file.")
        );
      }
    } catch (error) {
      console.error("Error creating file:", error);

      dispatch(setFileError("An error occurred while creating the file."));
    } finally {
      dispatch(setFileName("")); // Always clear input, success or failure
      dispatch(setIsFileInputSubmitting(false));
    }
  }
  // function handleBlur() {
  //   if (error || !fileName.trim()) {
  //     setError("");
  //     setFileName("");
  //     setIsFileInputVisible(false);
  //     return;
  //   }
  //   handleAddFile();
  // }

  // function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
  //   // Close input and return if user press enter without file name.
  //   if (event.key === "Enter" && !fileName.trim()) {
  //     setError("");
  //     setFileName("");
  //     setIsFileInputVisible(false);
  //     return;
  //     // Add file if user press enter without any errors
  //   } else if (event.key === "Enter" && !error) {
  //     handleAddFile(); // Create file when Enter key is pressed
  //   }
  // }
  useEffect(function () {
    fetchFiles();
  }, []);

  // Fetch folders when the component mounts
  useEffect(() => {
    fetchFolders();
  }, []); // Empty dependency array to call fetchFolders only once on mount

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

  // function handleFolderInputChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   const input = event.target.value;
  //   const isValid = /^[a-zA-Z0-9_-]*$/.test(input); // only letters, numbers, hyphens, and underscores are allowed.
  //   console.log(input);
  //   setFolderName(input);
  //   console.log(folderError);
  //   if (!input.trim()) {
  //     setFolderError("");
  //     return;
  //   } else if (!isValid) {
  //     setFolderError(
  //       "Folder name can only contain letters, numbers, dots, hyphens, and underscores."
  //     );
  //     return;
  //   }
  //   setFolderError(""); // clear error if input is valid
  // }

  // function handleFolderBlur() {
  //   if (folderError || !folderName.trim()) {
  //     setFolderError("");
  //     setFolderName("");
  //     setIsFolderInputVisible(false);
  //     return;
  //   }
  // }

  // function handleFolderKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
  //   if (event.key === "Enter" && !folderName.trim()) {
  //     setFolderError("");
  //     setIsFolderInputVisible(false);
  //     return;
  //     // Add file if user press enter without any errors
  //   } else if (event.key === "Enter" && !folderError) {
  //     handleAddFolder(); // Create file when Enter key is pressed
  //   }
  // }

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
          <NavbarEditor
          // setIsFileInputVisible={setIsFileInputVisible}
          // setIsFolderInputVisible={setIsFolderInputVisible}
          // setFileName={setFileName}
          // setFolderName={setFolderName}
          />
          {/*Show the file names here */}
          {/* <div className="file-list mt-4">
            {files.length > 0 ? (
              <ul>
                {files.map((file) => (
                  <li key={file.id} className=" text-white">
                    {file.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No files available</p>
            )}
          </div> */}
          <Files />
          {/* <div>
            {folders.length > 0 ? (
              <ul>
                {folders.map((folder) => (
                  <li key={folder.id} className="text-white">
                    {folder.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No folders available</p>
            )}
          </div> */}
          <Folders />
          {/* Show the input field when FolderPlus is clicked */}
          {/* {isFolderInputVisible && (
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
          )} */}
          <FilesInput handleAddFile={handleAddFile} />
          <FoldersInput handleAddFolder={handleAddFolder} />
          {/* Show the input field when FilePlus is clicked */}
          {/* {isFileInputVisible && (
            <div className="mt-4">
              <input
                type="text"
                autoFocus
                value={fileName}
                onChange={handleFileInputChange}
                disabled={isSubmitting}
                onBlur={handleBlur} // Call handleBlur when input loses focus
                onKeyDown={handleKeyDown} // Call handleAddFile when Enter is pressed
                placeholder={"Enter file name (e.g., file.cpp)"}
                className={clsx("w-full bg-[#121212] text-orangeCustom border-2", {
                  "border-red-500": error,
                  "border-white": !error,
                  "opacity-50 cursor-not-allowed": isSubmitting,
                })}
                ref={inputFileRef}
              />
              <p className="text-red-500 text-sm mt-2">{error}</p>
            </div>
          )} */}
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
