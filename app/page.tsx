import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileCheck, History, ClipboardList } from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-foreground leading-tight">
              Bina Marga Number Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Automatically generate BAST and Contract numbers with our streamlined system. 
              Replace manual registration books with digital efficiency.
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
                    <CardTitle className="text-2xl">BAST Number Generator</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Generate BAST numbers for your projects automatically
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm font-medium mb-2">Number Format:</p>
                    <code className="text-sm bg-background px-3 py-2 rounded border block font-mono">
                      SEQUENCE/BAST-BM/ROMAN_MONTH/YEAR
                    </code>
                    <p className="text-xs text-muted-foreground mt-2">
                      Example: 01/BAST-BM/X/2025
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/bast" className="flex-1">
                      <Button className="w-full" size="lg">
                        Generate BAST
                      </Button>
                    </Link>
                    <Link href="/bast/history" className="flex-1">
                      <Button variant="outline" className="w-full" size="lg">
                        <History className="h-4 w-4 mr-2" />
                        History
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
                    <CardTitle className="text-2xl">Contract Number Generator</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Generate contract numbers with location, work type, and procurement type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm font-medium mb-2">Number Format:</p>
                    <code className="text-sm bg-background px-3 py-2 rounded border block font-mono">
                      LOCATION/Bina Marga/WORK_TYPE/PROCUREMENT/SEQUENCE/MONTH/YEAR
                    </code>
                    <p className="text-xs text-muted-foreground mt-2">
                      Example: 621/Bina Marga/BM/SPK/01/X/2025
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/contract" className="flex-1">
                      <Button className="w-full" size="lg">
                        Generate Contract
                      </Button>
                    </Link>
                    <Link href="/contract/history" className="flex-1">
                      <Button variant="outline" className="w-full" size="lg">
                        <History className="h-4 w-4 mr-2" />
                        History
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
                  <CardTitle className="text-2xl">Welcome</CardTitle>
                  <CardDescription className="text-base">
                    Please sign in to access the number generators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/login" className="block">
                    <Button className="w-full" size="lg">
                      Sign In to Continue
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground">
                    Secure authentication required to generate numbers
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

