"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent hover:from-primary hover:to-primary/70 transition-all"
            >
              {t("nav.binaMarga")}
            </Link>
            {status === "authenticated" && (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  href="/bast"
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive("/bast")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {t("nav.bastGenerator")}
                </Link>
                <Link
                  href="/bast/history"
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive("/bast/history")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {t("nav.bastHistory")}
                </Link>
                <Link
                  href="/contract"
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive("/contract")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {t("nav.contractGenerator")}
                </Link>
                <Link
                  href="/contract/history"
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive("/contract/history")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {t("nav.contractHistory")}
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {status === "authenticated" ? (
              <>
                <span className="hidden sm:inline-block text-sm text-muted-foreground px-3 py-1.5 rounded-md bg-muted/50">
                  {session?.user?.email}
                </span>
                <Button variant="outline" onClick={() => signOut()} size="sm">
                  {t("common.signOut")}
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">{t("common.signIn")}</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


