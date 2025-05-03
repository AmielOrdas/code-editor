"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect } from "react";
import axios from "axios";

import { LANGUAGES_VERSIONS } from "@/lib/Types&Constants";

export default function ProgLanguageSelector({
  language,
  onSelectLanguage,
}: {
  language: string;
  onSelectLanguage: (language: string) => void;
}) {
  async function getLanguages() {
    const { data } = await axios.get("/api/languages");
    console.log(data);
  }

  useEffect(() => {
    getLanguages();
  }, []);

  return (
    <Select value={language} onValueChange={onSelectLanguage}>
      <SelectTrigger className="w-[180px] text-white">
        <SelectValue placeholder="Theme" className="text-white" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES_VERSIONS.map((languages) => (
          <SelectItem key={languages.language} value={languages.language.toLowerCase()}>
            {`${languages.language} - ${languages.version}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
