type TLanguage = {
  language: string;
  version: string;
  runtime: string;
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
const allowedLanguageExtensions = ["js", "py", "ts", "cpp", "java"];
const PISTON_RUNTIMES_URL = "https://emkc.org/api/v2/piston/runtimes";
const allowedLanguages = ["javascript", "typescript", "python", "java", "c++"];
const allowedRuntimes = ["node", "bash", "gcc"];

export type { TLanguage, TFile, TFolder };
export {
  allowedLanguageExtensions,
  PISTON_RUNTIMES_URL,
  allowedLanguages,
  allowedRuntimes,
};
