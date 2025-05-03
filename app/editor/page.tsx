"use client";
import CodeEditor from "@/components/CodeEditor";
import AnimationWrapper from "@/components/PageAnimationWrapper";
import ProgLanguageSelector from "@/components/ProgLanguageSelector";

import { useState, useEffect } from "react";

export default function ResizableLayout() {
  const [sidebarWidth, setSidebarWidth] = useState(300); // px
  const [topHeight, setTopHeight] = useState(700); // px
  const [language, setLanguage] = useState("javascript");

  const [rightSideWidth, setRightSideWidth] = useState<number>(0); // New state for right-side width

  useEffect(() => {
    setRightSideWidth(window.innerWidth - sidebarWidth);
  }, [sidebarWidth]);

  function onSideBarResize(e: MouseEvent) {
    if (e.clientX > 100) {
      setSidebarWidth((prevSideBarWidth) => (prevSideBarWidth = e.clientX));
    } else {
      setSidebarWidth((prevSideBarWidth) => (prevSideBarWidth = 0));
    }
  }

  function onBottomBarResize(e: MouseEvent) {
    setTopHeight(e.clientY);
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

  function onSelectLanguage(language: string) {
    setLanguage(language);
  }

  return (
    <AnimationWrapper>
      <div className="flex h-screen w-screen bg-[#121212]">
        {/* Sidebar */}
        <div className="max-w-[500px]" style={{ width: `${sidebarWidth}px` }}>
          {/* Left Sidebar */}
        </div>

        {/* Draggable vertical resizer */}
        <div
          onMouseDown={handleSidebarResize}
          className="cursor-col-resize bg-gray-400 transition-colors hover:bg-gray-300"
          style={{ width: "8px" }}
        />

        {/* Right side (top + bottom) */}
        <div
          className="flex flex-col flex-grow  "
          style={{ width: `${rightSideWidth}px` }}
        >
          {/* Top Section */}
          <div className="min-h-[200px]" style={{ height: `${topHeight}px` }}>
            {/* Top Section */}
            <CodeEditor height={topHeight} />
          </div>

          {/* Draggable horizontal resizer */}
          <div
            onMouseDown={handleHorizontalResize}
            className="cursor-row-resize bg-white"
            style={{ height: "4px" }}
          />

          {/* Bottom Section */}
          <div>
            <ProgLanguageSelector
              language={language}
              onSelectLanguage={onSelectLanguage}
            />
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}
