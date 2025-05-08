"use client";

import Editor from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import type * as monaco from "monaco-editor";

import { setCode } from "@/lib/redux/slice";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import CodeEditorPlaceHolder from "./CodeEditorPlaceHolder";
import { TFile } from "@/lib/Types&Constants";

export default function CodeEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const dispatch = useDispatch();
  const editorHeight = useSelector((state: RootState) => state.editorHeight.value);
  const selectedFileId = useSelector((state: RootState) => state.file.selectedFileId);
  const files = useSelector((state: RootState) => state.file.files);

  const selectedFileData = files.find((file: TFile) => file.id === selectedFileId);

  useEffect(() => {
    dispatch(setCode(selectedFileData?.content || ""));
  }, [selectedFileId, dispatch]);

  const code = useSelector((state: RootState) => state.code.value);
  const isMainFile = selectedFileId === process.env.NEXT_PUBLIC_WELCOME_FILE_ID;

  function onMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;

    editor.focus();
  }

  function getLanguageFromExtension(extension: string | null | undefined): string {
    console.log(extension);
    switch ((extension || "").toLowerCase()) {
      case "js":
        return "javascript";
      case "ts":
        return "typescript";
      case "py":
        return "python";
      case "cpp":
        return "cpp";
      case "java":
        return "java";
      default:
        return "plaintext"; // fallback language
    }
  }

  return (
    <>
      {selectedFileId ? (
        <Editor
          height={editorHeight}
          language={getLanguageFromExtension(selectedFileData?.extension)}
          value={code}
          theme="vs-dark"
          onChange={function (value) {
            dispatch(setCode(value || ""));
          }}
          onMount={onMount}
          className="min-h-[200px]"
          options={{
            readOnly: isMainFile,
          }}
        />
      ) : (
        <CodeEditorPlaceHolder />
      )}
    </>
  );
}
