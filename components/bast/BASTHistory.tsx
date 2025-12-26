"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BASTRecord } from "@/types";
import { Pencil } from "lucide-react";

export function BASTHistory() {
  const [records, setRecords] = useState<BASTRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState<string>("");
  const [editingRecord, setEditingRecord] = useState<BASTRecord | null>(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [editBastDate, setEditBastDate] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (yearFilter) {
        params.append("year", yearFilter);
      }

      const response = await fetch(`/api/bast/records?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch records");
      }

      setRecords(data.records || []);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [yearFilter]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleFilter = () => {
    fetchRecords();
  };

  const handleClearFilter = () => {
    setYearFilter("");
    fetchRecords();
  };

  const handleEdit = (record: BASTRecord) => {
    setEditingRecord(record);
    setEditProjectName(record.project_name);
    setEditBastDate(record.bast_date);
    setEditBudget(record.budget || "");
    setEditCompanyName(record.company_name || "");
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;

    setEditLoading(true);
    setEditError(null);

    try {
      const response = await fetch("/api/bast/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingRecord.id,
          project_name: editProjectName,
          bast_date: editBastDate,
          budget: editBudget || undefined,
          company_name: editCompanyName || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update record");
      }

      setEditingRecord(null);
      fetchRecords();
    } catch (err: any) {
      setEditError(err.message || "An error occurred");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">BAST Records History</CardTitle>
        <CardDescription className="text-base">View all generated BAST numbers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 items-end">
          <div className="flex-1">
            <Label htmlFor="year_filter">Filter by Year</Label>
            <Input
              id="year_filter"
              type="text"
              placeholder="e.g., 2025"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            />
          </div>
          <Button onClick={handleFilter}>Filter</Button>
          {yearFilter && (
            <Button variant="outline" onClick={handleClearFilter}>
              Clear
            </Button>
          )}
        </div>

        {loading && <p className="text-center py-4">Loading...</p>}

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <p className="text-center py-4 text-muted-foreground">
            No BAST records found.
          </p>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BAST Number</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>BAST Date</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono font-medium">
                      {record.bast_number}
                    </TableCell>
                    <TableCell>{record.project_name}</TableCell>
                    <TableCell>
                      {record.bast_date ? new Date(record.bast_date + 'T00:00:00').toLocaleDateString() : ''}
                    </TableCell>
                    <TableCell>{record.budget || '-'}</TableCell>
                    <TableCell>{record.company_name || '-'}</TableCell>
                    <TableCell>
                      {new Date(record.registration_datetime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(record)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={editingRecord !== null} onOpenChange={(open) => !open && setEditingRecord(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit BAST Record</DialogTitle>
              <DialogDescription>
                Update the project name and date. The BAST number will be regenerated based on the new date.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_project_name">Project Name</Label>
                <Input
                  id="edit_project_name"
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_bast_date">BAST Date</Label>
                <Input
                  id="edit_bast_date"
                  type="date"
                  value={editBastDate}
                  onChange={(e) => setEditBastDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_budget">Budget</Label>
                <Input
                  id="edit_budget"
                  type="text"
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  placeholder="Enter budget amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_company_name">Company Name</Label>
                <Input
                  id="edit_company_name"
                  type="text"
                  value={editCompanyName}
                  onChange={(e) => setEditCompanyName(e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              {editError && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  {editError}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingRecord(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={editLoading}>
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}


