"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileCheck, History } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

export default function HomePage() {
  const { data: session } = useSession();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-foreground leading-tight">
              {t("home.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.subtitle")}
            </p>
          </div>

          {session ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2 hover:border-primary/50 transition-colors shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl">{t("home.bastCard.title")}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {t("home.bastCard.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm font-medium mb-2">{t("home.bastCard.numberFormat")}</p>
                    <code className="text-sm bg-background px-3 py-2 rounded border block font-mono">
                      SEQUENCE/BAST-BM/ROMAN_MONTH/YEAR
                    </code>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t("home.bastCard.example")} 01/BAST-BM/X/2025
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/bast" className="flex-1">
                      <Button className="w-full" size="lg">
                        {t("home.bastCard.generateBast")}
                      </Button>
                    </Link>
                    <Link href="/bast/history" className="flex-1">
                      <Button variant="outline" className="w-full" size="lg">
                        <History className="h-4 w-4 mr-2" />
                        {t("home.bastCard.history")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <FileCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-2xl">{t("home.contractCard.title")}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {t("home.contractCard.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm font-medium mb-2">{t("home.contractCard.numberFormat")}</p>
                    <code className="text-sm bg-background px-3 py-2 rounded border block font-mono">
                      LOCATION/Bina Marga/WORK_TYPE/PROCUREMENT/SEQUENCE/MONTH/YEAR
                    </code>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t("home.contractCard.example")} 621/Bina Marga/BM/SPK/01/X/2025
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/contract" className="flex-1">
                      <Button className="w-full" size="lg">
                        {t("home.contractCard.generateContract")}
                      </Button>
                    </Link>
                    <Link href="/contract/history" className="flex-1">
                      <Button variant="outline" className="w-full" size="lg">
                        <History className="h-4 w-4 mr-2" />
                        {t("home.contractCard.history")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <Card className="border-2 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{t("home.welcome")}</CardTitle>
                  <CardDescription className="text-base">
                    {t("home.signInToAccess")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/login" className="block">
                    <Button className="w-full" size="lg">
                      {t("home.signInToContinue")}
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground">
                    {t("home.secureAuth")}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

