import React from "react";
import { useSelector } from "react-redux";

type TFolder = {
  id: string;
  name: string;
};

export default function Folders() {
  const folders = useSelector((state: any) => state.folder.folders);

  return (
    <div>
      {folders.length > 0 ? (
        <ul>
          {folders.map((folder: TFolder) => (
            <li key={folder.id} className="text-white">
              {folder.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No folders available</p>
      )}
    </div>
  );
}
