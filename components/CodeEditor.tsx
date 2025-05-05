"use client";

import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";
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

export default function CodeEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const dispatch = useDispatch();
  const editorHeight = useSelector((state: RootState) => state.editorHeight.value);
  const code = useSelector((state: RootState) => state.code.value);
  function onMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    editor.focus();
  }

  return (
    <Editor
      height={editorHeight}
      defaultLanguage="javascript"
      defaultValue={code}
      theme="vs-dark"
      onChange={(value) => dispatch(setCode(value || ""))}
      onMount={onMount}
      className="min-h-[200px]"
    />
  );
}
