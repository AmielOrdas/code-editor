"use client";

import {
  setRunData,
  setCodeSaveError,
  setIsRunning,
  setIsSaving,
  setIsCodeSaved,
} from "@/lib/redux/slice";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import axios, { isAxiosError } from "axios";
import { Button } from "../../ui/button";
import Spinner from "./SpinnerComponent";
import { fetchFiles } from "@/lib/functions";
import { renameFileSchema } from "@/lib/zod";
import { TFile, TLanguage } from "@/lib/Types&Constants";
import { Play, Save } from "lucide-react";

export default function OutputArea() {
  const languages = useSelector((state: RootState) => state.languages.value);
  const code = useSelector((state: RootState) => state.code.value);
  const selectedFileId = useSelector((state: RootState) => state.file.selectedFileId);
  const isCodeRunning = useSelector((state: RootState) => state.code?.isRunning);
  const isCodeSaving = useSelector((state: RootState) => state.code.isSaving);
  const files = useSelector((state: RootState) => state.file.files);
  const error = useSelector((state: RootState) => state.code.codeError);
  const isCodeSaved = useSelector((state: RootState) => state.code.isSaved);

  const selectedFileData = files.find((file: TFile) => file.id === selectedFileId);
  const isMainFile = selectedFileId === process.env.NEXT_PUBLIC_WELCOME_FILE_ID;

  const dispatch = useDispatch();

  const extensionToLanguageMap: Record<string, string> = {
    py: "python",
    ts: "typescript",
    js: "javascript",
    java: "java",
    cpp: "c++",
  };

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
      (lang: TLanguage) => lang.language.toLowerCase() === languageName
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

    try {
      const response = await axios.post("/api/execute", payload);
      const { data } = response.data;
      const { output } = data;

      dispatch(setRunData(output));
    } catch (error) {
      console.error("Error executing code:", error);
    }
    dispatch(setIsRunning(false));
  }

  async function handleSaveCode() {
    if (!selectedFileId) return;
    dispatch(setIsSaving(true));

    const parsed = renameFileSchema.safeParse({
      id: selectedFileId,
      name: selectedFileData?.name,
      extension: selectedFileData?.extension,
      content: code,
    });

    if (!parsed.success) {
      const errorMessage = parsed.error.errors[0]?.message;
      dispatch(setCodeSaveError(errorMessage));
    }

    try {
      const response = await axios.patch("/api/files", {
        id: selectedFileId,
        name: selectedFileData?.name,
        extension: selectedFileData?.extension,
        content: code,
      });

      console.log("File saved successfully:", response.data);
      dispatch(setIsCodeSaved(true));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        // If it's an Axios error, safely access the message
        console.error("Failed to save file:", error);
        dispatch(
          setCodeSaveError(
            error.response?.data?.message || "An error occurred while saving the file"
          )
        );
      } else {
        // If it's not an Axios error, handle it differently
        console.error("Unknown error occurred:", error);
        dispatch(setCodeSaveError("An unexpected error occurred"));
      }
    }
    dispatch(setIsSaving(false));
    setTimeout(() => dispatch(setIsCodeSaved(false)), 2000);

    fetchFiles(dispatch);
  }

  return (
    <div className="flex space-x-5">
      <Button
        className="border border-white cursor-pointer"
        onClick={handleSaveCode}
        disabled={isCodeSaving || isMainFile}
      >
        <Save />
        {isCodeSaving && <Spinner />}
        {error}
        {isCodeSaving ? (
          "Saving..."
        ) : isCodeSaved ? (
          <p className="text-green-500">Saved </p>
        ) : (
          "Save Code"
        )}
      </Button>

      <Button
        className="border border-white cursor-pointer"
        onClick={handleRunCode}
        disabled={isCodeRunning || isMainFile}
      >
        <Play />
        {isCodeRunning && <Spinner />}
        {isCodeRunning ? "Running..." : "Run Code"}
      </Button>
    </div>
  );
}
