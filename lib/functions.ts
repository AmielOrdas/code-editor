import { setFiles } from "@/lib/redux/slice";

export async function fetchFiles(dispatch: Function) {
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
