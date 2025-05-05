"use client";

import { useDispatch, useSelector } from "react-redux";

type TFile = {
  id: string;
  name: string;
  extension: string;
};

export default function Files() {
  // Access files from the redux state
  const files = useSelector((state: any) => state.file.files);

  return (
    <div className="file-list mt-4">
      {files.length > 0 ? (
        <ul>
          {files.map((file: TFile) => (
            <li key={file.id} className="text-white">
              {file.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No files available</p>
      )}
    </div>
  );
}
