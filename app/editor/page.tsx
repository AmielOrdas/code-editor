"use client";
import AnimationWrapper from "@/components/PageAnimationWrapper";
import { useState } from "react";

export default function ResizableLayout() {
  const [sidebarWidth, setSidebarWidth] = useState(300); // px
  const [topHeight, setTopHeight] = useState(900); // px

  function onSideBarResize(e: MouseEvent) {
    setSidebarWidth(e.clientX);
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

  return (
    <AnimationWrapper>
      <div className="flex h-screen w-screen bg-[#121212]">
        {/* Sidebar */}
        <div
          className="min-w-[300px] max-w-[500px]"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Left Sidebar */}
        </div>

        {/* Draggable vertical resizer */}
        <div
          onMouseDown={handleSidebarResize}
          className="cursor-col-resize bg-white"
          style={{ width: "4px" }}
        />

        {/* Right side (top + bottom) */}
        <div className="flex flex-col flex-grow">
          {/* Top Section */}
          <div className="min-h-[50px]" style={{ height: `${topHeight}px` }}>
            {/* Top Section */}
          </div>

          {/* Draggable horizontal resizer */}
          <div
            onMouseDown={handleHorizontalResize}
            className="cursor-row-resize bg-white"
            style={{ height: "4px" }}
          />

          {/* Bottom Section */}
          <div>{/* Bottom Section */}</div>
        </div>
      </div>
    </AnimationWrapper>
  );
}
