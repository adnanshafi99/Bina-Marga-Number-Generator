"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BASTGenerateRequest } from "@/types";
import { formatDateString, formatDateTimeString } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";
import { DateInput } from "@/components/ui/date-input";

export function BASTForm() {
  const { t } = useTranslation();
  const [projectName, setProjectName] = useState("");
  const [bastDate, setBastDate] = useState("");
  const [budget, setBudget] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/bast/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_name: projectName,
          bast_date: bastDate,
          budget: budget || undefined,
          company_name: companyName || undefined,
        } as BASTGenerateRequest),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errors.failedToGenerate"));
      }

      setResult(data);
      // Reset form
      setProjectName("");
      setBastDate("");
      setBudget("");
      setCompanyName("");
    } catch (err: any) {
      setError(err.message || t("errors.failedToGenerate"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">{t("bast.formTitle")}</CardTitle>
        <CardDescription className="text-base">
          {t("bast.formDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project_name">{t("bast.projectName")}</Label>
            <Input
              id="project_name"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              placeholder={t("bast.projectNamePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bast_date">{t("bast.bastDate")}</Label>
            <DateInput
              id="bast_date"
              value={bastDate}
              onChange={(value) => setBastDate(value)}
              required
              placeholder={t("bast.datePlaceholder")}
            />
            <p className="text-xs text-muted-foreground">{t("bast.dateFormatHint")}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">{t("bast.budget")}</Label>
            <Input
              id="budget"
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={t("bast.budgetPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_name">{t("bast.companyName")}</Label>
            <Input
              id="company_name"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder={t("bast.companyNamePlaceholder")}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t("bast.generating")}
              </>
            ) : (
              t("bast.generateButton")
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="h-5 w-5 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-semibold text-green-900 dark:text-green-100 text-lg">
                {t("bast.successTitle")}
              </h3>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">{t("bast.bastNumber")}</span>{" "}
                <span className="font-mono text-lg">{result.bast_number}</span>
              </p>
              <p>
                <span className="font-medium">{t("bast.projectNameLabel")}</span>{" "}
                {result.project_name}
              </p>
              <p>
                <span className="font-medium">{t("bast.bastDateLabel")}</span>{" "}
                {formatDateString(result.bast_date)}
              </p>
              <p>
                <span className="font-medium">{t("bast.registrationDate")}</span>{" "}
                {formatDateTimeString(result.registration_datetime)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


