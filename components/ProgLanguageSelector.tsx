"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  setSideBarWidth,
  setEditorHeight,
  setLanguage,
  setRightSideWidth,
  setLanguages,
  setRunData,
  setSelectedFolderId,
  setIsRunning,
  setIsSaving,
  setFiles,
} from "@/lib/redux/slice";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

import { useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import Spinner from "./SpinnerComponent";

type TLanguages = {
  language: string;
  version: string;
};
type TFile = {
  id: string;
  name: string;
  extension: string;
  folder_id: string | null;
  content: string;
};

export default function ProgLanguageSelector({}: {}) {
  const languages = useSelector((state: RootState) => state.languages.value);
  const code = useSelector((state: RootState) => state.code.value);
  const selectedFileId = useSelector((state: RootState) => state.file.selectedFileId);
  const isCodeRunning = useSelector((state: RootState) => state.code?.isRunning);
  const isCodeSaving = useSelector((state: RootState) => state.code.isSaving);
  const files = useSelector((state: RootState) => state.file.files);

  const selectedFileData = files.find((file: TFile) => file.id === selectedFileId);

  const dispatch = useDispatch();

  const extensionToLanguageMap: Record<string, string> = {
    py: "python",
    ts: "typescript",
    js: "javascript",
    java: "java",
    cpp: "c++",
  };

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

  async function getLanguages() {
    const { data } = await axios.get("/api/languages");

    dispatch(setLanguages(data));
  }

  useEffect(() => {
    getLanguages();
  }, []);
  console.log(languages);
  async function handleRunCode() {
    if (!selectedFileId || !code) return;
    dispatch(setIsRunning(true));
    const extension = selectedFileData?.extension.toLowerCase();

    const languageName = extensionToLanguageMap[extension || ""];

    if (!languageName) {
      console.error("Unsupported file extension:", extension);
      return;
    }

    // Find language entry that matches the file extension
    const languagedDetected = languages.find(
      (lang: TLanguages) => lang.language.toLowerCase() === languageName
    );

    if (!languagedDetected) {
      console.error("No matching language found for extension:", extension);
      return;
    }

    const payload = {
      language: languagedDetected.language,
      version: languagedDetected.version,
      code: code,
    };

    console.log(payload);

    try {
      const response = await axios.post("/api/execute", payload);
      const { data } = response.data;
      const { output } = data;
      console.log(output);
      dispatch(setRunData(output));
    } catch (error) {
      console.error("Error executing code:", error);
    }
    dispatch(setIsRunning(false));
  }

  async function handleSaveCode() {
    if (!selectedFileId) return;
    dispatch(setIsSaving(true));

    try {
      const response = await axios.patch("/api/files", {
        id: selectedFileId,
        name: selectedFileData?.name,
        extension: selectedFileData?.extension,
        content: code,
      });

      console.log("File saved successfully:", response.data);
    } catch (error) {
      console.error("Failed to save file:", error);
    }
    dispatch(setIsSaving(false));
    fetchFiles();
  }

  return (
    <div className="flex space-x-5">
      <Button className="border border-white cursor-pointer" onClick={handleSaveCode}>
        {isCodeSaving && <Spinner />}
        {isCodeSaving ? "Saving..." : "Save Code"}
      </Button>

      <Button className="border border-white cursor-pointer" onClick={handleRunCode}>
        {isCodeRunning && <Spinner />}
        {isCodeRunning ? "Running..." : "Run Code"}
      </Button>
    </div>
  );
}
