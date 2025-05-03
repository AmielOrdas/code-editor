"use client";

import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";
import type * as monaco from "monaco-editor";
export default function CodeEditor({ height }: { height: number }) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState("");

  function onMount(editor: monaco.editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    editor.focus();
  }

  return (
    <Editor
      height={height}
      defaultLanguage="javascript"
      defaultValue={code}
      theme="vs-dark"
      onChange={(value) => setCode(value || "")}
      onMount={onMount}
      className="min-h-[200px]"
    />
  );
}
