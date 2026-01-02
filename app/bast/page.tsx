"use client";

import { BASTForm } from "@/components/bast/BASTForm";
import { FileText } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

export default function BASTPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3">{t("bast.pageTitle")}</h1>
          <p className="text-lg text-muted-foreground">
            {t("bast.pageDescription")}
          </p>
        </div>
        <BASTForm />
      </div>
    </div>
  );
}


