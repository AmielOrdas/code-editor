// redux/slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TLanguages = {
  language: string;
  version: string;
};
type TFiles = {
  id: string;
  name: string;
  extension: string;
};

type TFolders = {
  id: string;
  name: string;
};

// Language slice
// In slice.ts
const languageSlice = createSlice({
  name: "language",
  initialState: {
    value: {
      language: "",
      version: "",
    },
  },
  reducers: {
    setLanguage(state, action: PayloadAction<TLanguages>) {
      state.value = action.payload;
    },
  },
});

// Languages slice
const languagesSlice = createSlice({
  name: "languages",
  initialState: { value: [] as TLanguages[] },
  reducers: {
    setLanguages(state, action: PayloadAction<TLanguages[]>) {
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
  initialState: { value: "" },
  reducers: {
    setCode(state, action: PayloadAction<string>) {
      state.value = action.payload;
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
    folders: [] as TFolders[],
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
    setFolders(state, action: PayloadAction<TFolders[]>) {
      state.folders = action.payload;
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
    files: [] as TFiles[],
  },
  reducers: {
    setFileName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setFileError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setIsFileInputVisible(state, action: PayloadAction<boolean>) {
      state.isInputVisible = action.payload;
    },
    setIsFileInputSubmitting(state, action: PayloadAction<boolean>) {
      state.isSubmitting = action.payload;
    },
    setFiles(state, action: PayloadAction<TFiles[]>) {
      state.files = action.payload;
    },
  },
});

// Export the actions and reducers
export const { setLanguage } = languageSlice.actions;
export const { setEditorHeight } = editorHeightSlice.actions;
export const { setRightSideWidth } = rightSideWidthSlice.actions;
export const { setCode } = codeSlice.actions;
export const { setSideBarWidth } = sideBarWidthSlice.actions;
export const { setLanguages } = languagesSlice.actions;
export const { setRunData } = runDataSlice.actions;
export const {
  setFolderName,
  setFolderError,
  setIsFolderInputVisible,
  setFolders,
  setIsFolderInputSubmitting,
} = folderSlice.actions;
export const {
  setFileName,
  setFileError,
  setIsFileInputVisible,
  setIsFileInputSubmitting,
  setFiles,
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
