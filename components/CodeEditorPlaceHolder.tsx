import React from "react";

export default function CodeEditorPlaceHolder() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-2xl font-jetbrains">
        <span className="text-white">&lt;{"{"}</span>
        <span className="text-orange2Custom">No file selected</span>
        <span className="text-white">{"}"}&gt;</span>
      </div>
    </div>
  );
}
