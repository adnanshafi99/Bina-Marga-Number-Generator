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
import { useTranslation } from "@/lib/i18n/context";
import { formatDateString, formatDateTimeString } from "@/lib/utils";
import { DateInput } from "@/components/ui/date-input";

export function BASTHistory() {
  const { t } = useTranslation();
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
        throw new Error(data.error || t("errors.failedToFetch"));
      }

      setRecords(data.records || []);
    } catch (err: any) {
      setError(err.message || t("errors.failedToFetch"));
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
        throw new Error(data.error || t("errors.failedToUpdate"));
      }

      setEditingRecord(null);
      fetchRecords();
    } catch (err: any) {
      setEditError(err.message || t("errors.failedToUpdate"));
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">{t("bast.historyTitle")}</CardTitle>
        <CardDescription className="text-base">{t("bast.historyDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 items-end">
          <div className="flex-1">
            <Label htmlFor="year_filter">{t("bast.filterByYear")}</Label>
            <Input
              id="year_filter"
              type="text"
              placeholder={t("bast.yearPlaceholder")}
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            />
          </div>
          <Button onClick={handleFilter}>{t("common.filter")}</Button>
          {yearFilter && (
            <Button variant="outline" onClick={handleClearFilter}>
              {t("common.clear")}
            </Button>
          )}
        </div>

        {loading && <p className="text-center py-4">{t("common.loading")}</p>}

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <p className="text-center py-4 text-muted-foreground">
            {t("bast.noRecords")}
          </p>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("bast.tableHeaders.bastNumber")}</TableHead>
                  <TableHead>{t("bast.tableHeaders.projectName")}</TableHead>
                  <TableHead>{t("bast.tableHeaders.bastDate")}</TableHead>
                  <TableHead>{t("bast.tableHeaders.budget")}</TableHead>
                  <TableHead>{t("bast.tableHeaders.companyName")}</TableHead>
                  <TableHead>{t("bast.tableHeaders.registrationDate")}</TableHead>
                  <TableHead>{t("bast.tableHeaders.actions")}</TableHead>
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
                      {record.bast_date ? formatDateString(record.bast_date) : ''}
                    </TableCell>
                    <TableCell>{record.budget || '-'}</TableCell>
                    <TableCell>{record.company_name || '-'}</TableCell>
                    <TableCell>
                      {formatDateTimeString(record.registration_datetime)}
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
              <DialogTitle>{t("bast.editDialog.title")}</DialogTitle>
              <DialogDescription>
                {t("bast.editDialog.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit_project_name">{t("bast.projectName")}</Label>
                <Input
                  id="edit_project_name"
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_bast_date">{t("bast.bastDate")}</Label>
                <DateInput
                  id="edit_bast_date"
                  value={editBastDate}
                  onChange={(value) => setEditBastDate(value)}
                  required
                  placeholder={t("bast.datePlaceholder")}
                />
                <p className="text-xs text-muted-foreground">{t("bast.dateFormatHint")}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_budget">{t("bast.budget")}</Label>
                <Input
                  id="edit_budget"
                  type="text"
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  placeholder={t("bast.budgetPlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_company_name">{t("bast.companyName")}</Label>
                <Input
                  id="edit_company_name"
                  type="text"
                  value={editCompanyName}
                  onChange={(e) => setEditCompanyName(e.target.value)}
                  placeholder={t("bast.companyNamePlaceholder")}
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
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSaveEdit} disabled={editLoading}>
                {editLoading ? t("common.saving") : t("common.saveChanges")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}


