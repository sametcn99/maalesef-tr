"use client";

import { Table, Badge } from "@radix-ui/themes";
import { Clock, XCircle, ChevronRight } from "lucide-react";
import type { Application } from "@/types";

interface ApplicationTableProps {
  applications: Application[];
  onRowClick: (application: Application) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ApplicationTable({
  applications,
  onRowClick,
}: ApplicationTableProps) {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-hover text-muted-light">
          <Clock size={22} />
        </div>
        <p className="mt-4 text-sm font-medium text-muted">
          Henüz başvuru yapılmadı.
        </p>
        <p className="mt-1 text-xs text-muted-light">
          İlanlar sayfasından ilk başvurunuzu yapabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <Table.Root className="overflow-hidden rounded-xl border border-border shadow-none">
      <Table.Header>
        <Table.Row className="bg-surface text-muted text-xs uppercase tracking-widest font-semibold">
          <Table.ColumnHeaderCell>Pozisyon</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Durum</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Başvuru Tarihi</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell style={{ width: 40 }}>
            {""}
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {applications.map((app) => (
          <Table.Row
            key={app.id}
            onClick={() => onRowClick(app)}
            className="cursor-pointer border-b border-border transition-colors duration-150 hover:bg-accent-muted/30"
          >
            <Table.Cell>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-xs font-bold text-accent">
                  {app.jobTitle.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-foreground">
                  {app.jobTitle}
                </span>
              </div>
            </Table.Cell>
            <Table.Cell>
              <Badge
                size="2"
                variant="soft"
                color={app.status === "pending" ? "amber" : "red"}
                className="gap-1 text-xs"
              >
                {app.status === "pending" ? (
                  <Clock size={12} />
                ) : (
                  <XCircle size={12} />
                )}
                {app.status === "pending" ? "Değerlendiriliyor" : "Reddedildi"}
              </Badge>
            </Table.Cell>
            <Table.Cell className="text-muted">
              {formatDate(app.appliedAt)}
            </Table.Cell>
            <Table.Cell>
              <ChevronRight size={16} className="text-muted-light" />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
