"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContractRecord } from "@/types";
import { Pencil } from "lucide-react";

export function ContractHistory() {
  const [records, setRecords] = useState<ContractRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [workTypeFilter, setWorkTypeFilter] = useState<string>("");
  const [procurementTypeFilter, setProcurementTypeFilter] = useState<string>("");
  const [editingRecord, setEditingRecord] = useState<ContractRecord | null>(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [editContractDate, setEditContractDate] = useState("");
  const [editLocation, setEditLocation] = useState<"621" | "622">("621");
  const [editWorkType, setEditWorkType] = useState<"BM" | "BM-KONS">("BM");
  const [editProcurementType, setEditProcurementType] = useState<"SP" | "SPK">("SPK");
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
      if (locationFilter) {
        params.append("location_code", locationFilter);
      }
      if (workTypeFilter) {
        params.append("work_type", workTypeFilter);
      }
      if (procurementTypeFilter) {
        params.append("procurement_type", procurementTypeFilter);
      }

      const response = await fetch(`/api/contract/records?${params.toString()}`);
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
  }, [yearFilter, locationFilter, workTypeFilter, procurementTypeFilter]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleFilter = () => {
    fetchRecords();
  };

  const handleClearFilter = () => {
    setYearFilter("");
    setLocationFilter("");
    setWorkTypeFilter("");
    setProcurementTypeFilter("");
    fetchRecords();
  };

  const handleEdit = (record: ContractRecord) => {
    setEditingRecord(record);
    setEditProjectName(record.project_name);
    setEditContractDate(record.contract_date);
    setEditLocation(record.location_code as "621" | "622");
    setEditWorkType(record.work_type as "BM" | "BM-KONS");
    setEditProcurementType(record.procurement_type as "SP" | "SPK");
    setEditBudget(record.budget || "");
    setEditCompanyName(record.company_name || "");
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;

    setEditLoading(true);
    setEditError(null);

    try {
      const response = await fetch("/api/contract/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingRecord.id,
          project_name: editProjectName,
          contract_date: editContractDate,
          location: editLocation,
          work_type: editWorkType,
          procurement_type: editProcurementType,
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
        <CardTitle className="text-2xl">Contract Records History</CardTitle>
        <CardDescription className="text-base">View all generated contract numbers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="year_filter">Filter by Year</Label>
            <Input
              id="year_filter"
              type="text"
              placeholder="e.g., 2025"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="location_filter">Location</Label>
            <Select
              value={locationFilter || "all"}
              onValueChange={(value) => setLocationFilter(value === "all" ? "" : value)}
            >
              <SelectTrigger id="location_filter">
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="621">Karimun Island</SelectItem>
                <SelectItem value="622">Outside Karimun Island</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="work_type_filter">Work Type</Label>
            <Select
              value={workTypeFilter || "all"}
              onValueChange={(value) => setWorkTypeFilter(value === "all" ? "" : value)}
            >
              <SelectTrigger id="work_type_filter">
                <SelectValue placeholder="All work types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Work Types</SelectItem>
                <SelectItem value="BM">Physical Work (BM)</SelectItem>
                <SelectItem value="BM-KONS">Consultancy (BM-KONS)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="procurement_type_filter">Procurement Type</Label>
            <Select
              value={procurementTypeFilter || "all"}
              onValueChange={(value) => setProcurementTypeFilter(value === "all" ? "" : value)}
            >
              <SelectTrigger id="procurement_type_filter">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="SP">Tender (SP)</SelectItem>
                <SelectItem value="SPK">Direct Procurement (SPK)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <Button onClick={handleFilter}>Apply Filters</Button>
          {(yearFilter || locationFilter || workTypeFilter || procurementTypeFilter) && (
            <Button variant="outline" onClick={handleClearFilter}>
              Clear Filters
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
            No contract records found.
          </p>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract Number</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Contract Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Work Type</TableHead>
                  <TableHead>Procurement</TableHead>
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
                      {record.contract_number}
                    </TableCell>
                    <TableCell>{record.project_name}</TableCell>
                    <TableCell>
                      {record.contract_date ? new Date(record.contract_date + 'T00:00:00').toLocaleDateString() : ''}
                    </TableCell>
                    <TableCell>
                      {record.location_code === "621"
                        ? "Karimun Island"
                        : "Outside Karimun Island"}
                    </TableCell>
                    <TableCell>{record.work_type}</TableCell>
                    <TableCell>{record.procurement_type}</TableCell>
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Contract Record</DialogTitle>
              <DialogDescription>
                Update the contract details. The contract number will be regenerated based on the new inputs.
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
                <Label htmlFor="edit_contract_date">Contract Date</Label>
                <Input
                  id="edit_contract_date"
                  type="date"
                  value={editContractDate}
                  onChange={(e) => setEditContractDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_location">Location</Label>
                  <Select
                    value={editLocation}
                    onValueChange={(value) => setEditLocation(value as "621" | "622")}
                  >
                    <SelectTrigger id="edit_location">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="621">Karimun Island (621)</SelectItem>
                      <SelectItem value="622">Outside Karimun Island (622)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_work_type">Work Type</Label>
                  <Select
                    value={editWorkType}
                    onValueChange={(value) => setEditWorkType(value as "BM" | "BM-KONS")}
                  >
                    <SelectTrigger id="edit_work_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BM">Physical Work (BM)</SelectItem>
                      <SelectItem value="BM-KONS">Consultancy (BM-KONS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_procurement_type">Procurement Type</Label>
                  <Select
                    value={editProcurementType}
                    onValueChange={(value) => setEditProcurementType(value as "SP" | "SPK")}
                  >
                    <SelectTrigger id="edit_procurement_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">Tender (SP)</SelectItem>
                      <SelectItem value="SPK">Direct Procurement (SPK)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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


