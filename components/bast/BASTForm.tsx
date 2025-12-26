"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BASTGenerateRequest } from "@/types";
import { formatDateString } from "@/lib/utils";

export function BASTForm() {
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
        throw new Error(data.error || "Failed to generate BAST number");
      }

      setResult(data);
      // Reset form
      setProjectName("");
      setBastDate("");
      setBudget("");
      setCompanyName("");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">Generate BAST Number</CardTitle>
        <CardDescription className="text-base">
          Enter project details to generate a new BAST number
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project_name">Project / Work Name</Label>
            <Input
              id="project_name"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              placeholder="Enter project or work name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bast_date">BAST Date</Label>
            <Input
              id="bast_date"
              type="date"
              value={bastDate}
              onChange={(e) => setBastDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter budget amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
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
                Generating...
              </>
            ) : (
              "Generate BAST Number"
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
                BAST Number Generated Successfully!
              </h3>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">BAST Number:</span>{" "}
                <span className="font-mono text-lg">{result.bast_number}</span>
              </p>
              <p>
                <span className="font-medium">Project Name:</span>{" "}
                {result.project_name}
              </p>
              <p>
                <span className="font-medium">BAST Date:</span>{" "}
                {formatDateString(result.bast_date)}
              </p>
              <p>
                <span className="font-medium">Registration Date:</span>{" "}
                {new Date(result.registration_datetime).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


