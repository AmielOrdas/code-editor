type TLanguage = {
  language: string;
  version: string;
};
type TFile = {
  id: string;
  name: string;
  extension: string;
  folder_id: string | null;
  content: string;
};

type TFolder = {
  id: string;
  name: string;
  parent_id: string | null;
};
const allowedLanguageExtensions = [".js", ".py", ".ts", ".cpp", ".java"];

export type { TLanguage, TFile, TFolder };
export { allowedLanguageExtensions };
