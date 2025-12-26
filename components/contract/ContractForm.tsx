"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContractGenerateRequest } from "@/types";
import { formatDateString } from "@/lib/utils";

export function ContractForm() {
  const [projectName, setProjectName] = useState("");
  const [contractDate, setContractDate] = useState("");
  const [location, setLocation] = useState<"621" | "622">("621");
  const [workType, setWorkType] = useState<"BM" | "BM-KONS">("BM");
  const [procurementType, setProcurementType] = useState<"SP" | "SPK">("SPK");
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
      const response = await fetch("/api/contract/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_name: projectName,
          contract_date: contractDate,
          location,
          work_type: workType,
          procurement_type: procurementType,
          budget: budget || undefined,
          company_name: companyName || undefined,
        } as ContractGenerateRequest),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate contract number");
      }

      setResult(data);
      // Reset form
      setProjectName("");
      setContractDate("");
      setLocation("621");
      setWorkType("BM");
      setProcurementType("SPK");
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
        <CardTitle className="text-2xl">Generate Contract Number</CardTitle>
        <CardDescription className="text-base">
          Enter contract details to generate a new contract number
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
            <Label htmlFor="contract_date">Contract Date</Label>
            <Input
              id="contract_date"
              type="date"
              value={contractDate}
              onChange={(e) => setContractDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select
              value={location}
              onValueChange={(value) => setLocation(value as "621" | "622")}
            >
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="621">Karimun Island (621)</SelectItem>
                <SelectItem value="622">Outside Karimun Island (622)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="work_type">Work Type</Label>
            <Select
              value={workType}
              onValueChange={(value) => setWorkType(value as "BM" | "BM-KONS")}
            >
              <SelectTrigger id="work_type">
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BM">Physical Work (BM)</SelectItem>
                <SelectItem value="BM-KONS">Consultancy (BM-KONS)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="procurement_type">Procurement Type</Label>
            <Select
              value={procurementType}
              onValueChange={(value) =>
                setProcurementType(value as "SP" | "SPK")
              }
            >
              <SelectTrigger id="procurement_type">
                <SelectValue placeholder="Select procurement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SP">Tender (SP)</SelectItem>
                <SelectItem value="SPK">Direct Procurement (SPK)</SelectItem>
              </SelectContent>
            </Select>
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
              "Generate Contract Number"
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
                Contract Number Generated Successfully!
              </h3>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Contract Number:</span>{" "}
                <span className="font-mono text-lg">
                  {result.contract_number}
                </span>
              </p>
              <p>
                <span className="font-medium">Project Name:</span>{" "}
                {result.project_name}
              </p>
              <p>
                <span className="font-medium">Contract Date:</span>{" "}
                {formatDateString(result.contract_date)}
              </p>
              <p>
                <span className="font-medium">Location:</span>{" "}
                {result.location_code === "621"
                  ? "Karimun Island"
                  : "Outside Karimun Island"}
              </p>
              <p>
                <span className="font-medium">Work Type:</span> {result.work_type}
              </p>
              <p>
                <span className="font-medium">Procurement Type:</span>{" "}
                {result.procurement_type}
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


