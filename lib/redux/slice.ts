// redux/slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TLanguage, TFile, TFolder } from "../Types&Constants";

// Language slice
const languageSlice = createSlice({
  name: "language",
  initialState: {
    value: {
      language: "",
      version: "",
    },
  },
  reducers: {
    setLanguage(state, action: PayloadAction<TLanguage>) {
      state.value = action.payload;
    },
  },
});

// Languages slice
const languagesSlice = createSlice({
  name: "languages",
  initialState: { value: [] as TLanguage[] },
  reducers: {
    setLanguages(state, action: PayloadAction<TLanguage[]>) {
      state.value = action.payload;
    },
  },
});

// EditorHeight slice
const editorHeightSlice = createSlice({
  name: "editorHeight",
  initialState: { value: 700 },
  reducers: {
    setEditorHeight(state, action: PayloadAction<number>) {
      state.value = action.payload;
    },
  },
});

const sideBarWidthSlice = createSlice({
  name: "sideBarWidth",
  initialState: { value: 300 },
  reducers: {
    setSideBarWidth(state, action: PayloadAction<number>) {
      state.value = action.payload;
    },
  },
});

// RightSideWidth slice
const rightSideWidthSlice = createSlice({
  name: "rightSideWidth",
  initialState: { value: 300 },
  reducers: {
    setRightSideWidth(state, action: PayloadAction<number>) {
      state.value = action.payload;
    },
  },
});

// Code slice
const codeSlice = createSlice({
  name: "code",
  initialState: {
    value: "",
    isRunning: false,
    isSaving: false,
    codeError: "",
    isSaved: false,
  },
  reducers: {
    setCode(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
    setIsRunning(state, action: PayloadAction<boolean>) {
      state.isRunning = action.payload;
    },
    setIsSaving(state, action: PayloadAction<boolean>) {
      state.isSaving = action.payload;
    },
    setIsCodeSaved(state, action: PayloadAction<boolean>) {
      state.isSaved = action.payload;
    },
    setCodeSaveError(state, action: PayloadAction<string>) {
      state.codeError = action.payload;
    },
  },
});

const runDataSlice = createSlice({
  name: "runData",
  initialState: { value: "" },
  reducers: {
    setRunData(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
  },
});

const folderSlice = createSlice({
  name: "folder",
  initialState: {
    name: "",
    error: "",
    isInputVisible: false,
    isSubmitting: false,
    isRenameInputSubmitting: false,
    renameFolderId: "",
    renameError: "",
    folders: [] as TFolder[],
    selectedFolderId: "", // Track the selected folder
    expandedFolders: [] as string[],
  },
  reducers: {
    setFolderName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setFolderError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setIsFolderInputSubmitting(state, action: PayloadAction<boolean>) {
      state.isSubmitting = action.payload;
    },
    setIsFolderInputVisible(state, action: PayloadAction<boolean>) {
      state.isInputVisible = action.payload;
    },
    setIsFolderRenameInputSubmitting(state, action: PayloadAction<boolean>) {
      state.isRenameInputSubmitting = action.payload;
    },
    setRenameFolderId(state, action: PayloadAction<string>) {
      state.renameFolderId = action.payload;
    },
    setFolderRenameError(state, action: PayloadAction<string>) {
      state.renameError = action.payload;
    },
    setFolders(state, action: PayloadAction<TFolder[]>) {
      state.folders = action.payload;
    },
    setSelectedFolderId(state, action: PayloadAction<string>) {
      state.selectedFolderId = action.payload;
    },
    setExpandedFolders(state, action: PayloadAction<string[]>) {
      state.expandedFolders = action.payload;
    },
  },
});

const fileSlice = createSlice({
  name: "file",
  initialState: {
    name: "",
    error: "",
    isInputVisible: false,
    isSubmitting: false,
    renameFileId: "",
    isRenameInputSubmitting: false,
    renameError: "",
    files: [] as TFile[],
    selectedFileId: "", // Track the selected file
  },
  reducers: {
    setFileName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setFileError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setFileRenameError(state, action: PayloadAction<string>) {
      state.renameError = action.payload;
    },
    setIsFileInputVisible(state, action: PayloadAction<boolean>) {
      state.isInputVisible = action.payload;
    },
    setRenameFileId(state, action: PayloadAction<string>) {
      state.renameFileId = action.payload;
    },
    setIsFileInputSubmitting(state, action: PayloadAction<boolean>) {
      state.isSubmitting = action.payload;
    },
    setIsFileRenameInputSubmitting(state, action: PayloadAction<boolean>) {
      state.isSubmitting = action.payload;
    },
    setFiles(state, action: PayloadAction<TFile[]>) {
      state.files = action.payload;
    },
    setSelectedFileId(state, action: PayloadAction<string>) {
      state.selectedFileId = action.payload;
    },
  },
});

// Export the actions and reducers
export const { setLanguage } = languageSlice.actions;
export const { setEditorHeight } = editorHeightSlice.actions;
export const { setRightSideWidth } = rightSideWidthSlice.actions;
export const { setCode, setIsRunning, setIsSaving, setCodeSaveError, setIsCodeSaved } =
  codeSlice.actions;
export const { setSideBarWidth } = sideBarWidthSlice.actions;
export const { setLanguages } = languagesSlice.actions;
export const { setRunData } = runDataSlice.actions;
export const {
  setFolderName,
  setFolderError,
  setIsFolderInputVisible,
  setFolders,
  setIsFolderInputSubmitting,
  setSelectedFolderId,
  setIsFolderRenameInputSubmitting,
  setFolderRenameError,
  setRenameFolderId,
  setExpandedFolders,
} = folderSlice.actions;

export const {
  setFileName,
  setFileError,
  setIsFileInputVisible,
  setIsFileInputSubmitting,
  setFiles,
  setSelectedFileId,
  setFileRenameError,
  setIsFileRenameInputSubmitting,
  setRenameFileId,
} = fileSlice.actions;

export const rootReducer = {
  language: languageSlice.reducer,
  languages: languagesSlice.reducer,
  editorHeight: editorHeightSlice.reducer,
  rightSideWidth: rightSideWidthSlice.reducer,
  code: codeSlice.reducer,
  sideBarWidth: sideBarWidthSlice.reducer,
  runData: runDataSlice.reducer,
  folder: folderSlice.reducer,
  file: fileSlice.reducer,
};
