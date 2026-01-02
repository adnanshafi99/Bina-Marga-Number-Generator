"use client";

import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "id")}>
        <SelectTrigger className="w-[120px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="id">Bahasa Indonesia</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

