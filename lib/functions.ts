import { setFiles, setFolders } from "@/lib/redux/slice";

async function fetchFiles(dispatch: Function) {
  try {
    const response = await fetch("/api/files");

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to fetch files");
    }

    const { files } = await response.json();
    dispatch(setFiles(files));
  } catch (error) {
    console.error("Error fetching files:", error);
    dispatch(setFiles([]));
  }
}

async function fetchFolders(dispatch: Function) {
  try {
    const response = await fetch("/api/folders");

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to fetch folders");
    }

    const data = await response.json();
    dispatch(setFolders(data.folders)); // Assuming you have state for storing folders
  } catch (error) {
    console.error("Error fetching folders:", error);
    dispatch(setFolders([])); // Clear folders in case of error
  }
}

export { fetchFiles, fetchFolders };
