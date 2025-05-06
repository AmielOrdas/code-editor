import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsSubFolderInputVisible,
  setSubFolderParentId,
  setSubFolderName,
  setSubFolderError,
} from "@/lib/redux/slice"; // Assuming these are defined in your Redux slice
import { RootState } from "@/lib/redux/store";
import clsx from "clsx";

type SubFolderInputProps = {
  parentId: string;
  handleAddFolder: (name: string, parentId: string) => void; // Updated type for handleAddFolder to accept parameters
};

export default function SubFolderInput({
  parentId,
  handleAddFolder,
}: SubFolderInputProps) {
  const dispatch = useDispatch();
  console.log("This is subfolder input");
  // Redux states
  const subFolderName = useSelector((state: RootState) => state.subFolder.subFolderName); // Get subfolder name from Redux store
  const subFolderError = useSelector(
    (state: RootState) => state.subFolder.subFolderError
  ); // Get subfolder error from Redux store
  const isSubmitting = useSelector(
    (state: RootState) => state.subFolder.isSubFolderInputSubmitting
  );
  const isSubFolderInputVisible = useSelector(
    (state: any) => state.subFolder.isSubFolderInputVisible
  ); // Get visibility from Redux
  const subFolderParentId = useSelector((state: any) => state.subFolder.parentId); // Get parent ID from Redux (for subfolder)

  // Update Redux state with the parent folder ID when parentId prop changes
  useEffect(() => {
    dispatch(setSubFolderParentId(parentId)); // Store the parentId in Redux
  }, [parentId, dispatch]);

  // Handle folder name change (updating Redux state)
  function handleSubFolderInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;
    const isValid = /^[a-zA-Z0-9_-]*$/.test(input); // only letters, numbers, hyphens, and underscores are allowed.
    dispatch(setSubFolderName(event.target.value)); // Update Redux state with new subfolder name
    if (!input.trim()) {
      dispatch(setSubFolderError(""));
      return;
    } else if (!isValid) {
      dispatch(
        setSubFolderError(
          "Folder name can only contain letters, numbers, dots, hyphens, and underscores."
        )
      );
      return;
    }
    dispatch(setSubFolderError("")); // clear error if input is valid
  }

  // Handle folder creation when Enter is pressed
  function handleSubFolderKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" && !subFolderName.trim()) {
      console.log("Nothing happens");
      dispatch(setSubFolderError(""));
      dispatch(setIsSubFolderInputVisible(false));
      return;
      // Add file if user press enter without any errors
    } else if (event.key === "Enter" && !subFolderError) {
      console.log("sub folder");
      handleAddFolder(subFolderName, parentId); // Create file when Enter key is pressed
    }
  }

  // Handle onBlur (clicking outside input field)
  function handleSubFolderBlur() {
    if (subFolderError || !subFolderName.trim()) {
      dispatch(setSubFolderError(""));
      dispatch(setSubFolderName(""));
      dispatch(setIsSubFolderInputVisible(false));
      return;
    }
    handleAddFolder(subFolderName, parentId);
  }

  return (
    <div className="mt-4">
      <input
        type="text"
        autoFocus
        value={subFolderName}
        disabled={isSubmitting}
        onChange={handleSubFolderInputChange}
        onBlur={handleSubFolderBlur}
        onKeyDown={handleSubFolderKeyDown}
        placeholder="Enter subfolder name"
        className={clsx("w-full bg-[#121212] text-orangeCustom border-2", {
          "border-red-500": subFolderError,
          "border-white": !subFolderError,
          "opacity-50 cursor-not-allowed": isSubmitting,
        })}
      />
      {subFolderError && <p className="text-red-500 text-sm mt-2">{subFolderError}</p>}
    </div>
  );
}
