"use client";

import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import type * as monaco from "monaco-editor";

import {
  setSideBarWidth,
  setEditorHeight,
  setLanguage,
  setRightSideWidth,
  setLanguages,
  setCode,
} from "@/lib/redux/slice";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import CodeEditorPlaceHolder from "./CodeEditorPlaceHolder";

type TFile = {
  id: string;
  name: string;
  extension: string;
  folder_id: string | null;
  content: string;
};

export default function CodeEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const dispatch = useDispatch();
  const editorHeight = useSelector((state: RootState) => state.editorHeight.value);
  const selectedFileId = useSelector((state: RootState) => state.file.selectedFileId);
  const files = useSelector((state: RootState) => state.file.files);
  console.log("FILES", files);

  const selectedFileData = files.find((file: TFile) => file.id === selectedFileId);

  useEffect(() => {
    dispatch(setCode(selectedFileData?.content || ""));
  }, [selectedFileId]);

  const code = useSelector((state: RootState) => state.code.value);

  function onMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;

    editor.focus();
  }

  return (
    <>
      {selectedFileId ? (
        <Editor
          height={editorHeight}
          defaultLanguage="javascript"
          defaultValue={code}
          theme="vs-dark"
          onChange={function (value) {
            dispatch(setCode(value || ""));
          }}
          onMount={onMount}
          className="min-h-[200px]"
        />
      ) : (
        <CodeEditorPlaceHolder />
      )}
    </>
  );
}
