"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  setSideBarWidth,
  setEditorHeight,
  setLanguage,
  setRightSideWidth,
  setLanguages,
  setRunData,
} from "@/lib/redux/slice";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

import { useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";

type TLanguages = {
  language: string;
  version: string;
  aliases: string[];
  runtime?: string;
};

export default function ProgLanguageSelector({}: {}) {
  const languageObj = useSelector((state: RootState) => state.language.value);
  const languages = useSelector((state: RootState) => state.languages.value);
  const code = useSelector((state: RootState) => state.code.value);

  const dispatch = useDispatch();

  async function getLanguages() {
    const { data } = await axios.get("/api/languages");

    dispatch(setLanguages(data));
  }

  useEffect(() => {
    getLanguages();
  }, []);

  async function handleRunCode() {
    if (!languageObj.language || !languageObj.version || !code) return;

    const payload = {
      language: languageObj.language,
      version: languageObj.version,
      code: code,
    };

    console.log(payload);

    try {
      const response = await axios.post("/api/execute", payload);
      const { data } = response.data;
      const { output } = data;
      console.log(output);
      dispatch(setRunData(output));
    } catch (error) {
      console.error("Error executing code:", error);
    }
  }
  console.log(typeof code);

  return (
    <div className="flex space-x-5">
      <Select
        value={JSON.stringify(languageObj)}
        onValueChange={(val) => {
          const selected = JSON.parse(val);
          dispatch(setLanguage(selected));
        }}
      >
        <SelectTrigger className="w-[180px] text-white">
          <SelectValue className="text-white">
            {languageObj.language && languageObj.version
              ? `${languageObj.language} - ${languageObj.version}`
              : "Select Language"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((languages) => (
            <SelectItem
              key={`${languages.language}-${languages.version}`}
              value={JSON.stringify(languages)}
            >
              {`${languages.language} - ${languages.version}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button className="border border-white" onClick={handleRunCode}>
        Run Code
      </Button>
    </div>
  );
}
