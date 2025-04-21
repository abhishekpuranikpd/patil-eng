"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, FileDown, Eye, Plus } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ViewInquiryModal from "./view-inq-modal";
import Link from "next/link";

export default function InquiryTable({ data }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.customer.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.customer.contact?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status ? item.status === status : true;
      const matchSource = source ? item.source === source : true;
      return matchSearch && matchStatus && matchSource;
    });
  }, [search, status, source, data]);

  const columns = useMemo(
    () => [
      {
        header: "Customer",
        accessorKey: "customer",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.customer.name}</p>
            <p className="text-sm text-muted-foreground">
              {row.original.customer.contact}
            </p>
          </div>
        ),
      },
      {
        header: "Source",
        accessorKey: "source",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              row.original.status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : row.original.status === "FOLLOWED_UP"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
      },
      {
        header: "Actions",
        cell: ({ row }) => <ViewInquiryModal inquiry={row.original} />,
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportToExcel = () => {
    const cleaned = filteredData.map(({ customer, ...rest }) => ({
      ...rest,
      customerName: customer.name,
      customerContact: customer.contact,
    }));
    const worksheet = XLSX.utils.json_to_sheet(cleaned);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inquiries");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "inquiries.xlsx");
  };
  const handleSelectChange = (value, type) => {
    // Handle changes for both Source and Status Select
    if (type === "source") {
      setSource(value === "all" ? null : value); // Reset to null if "all" selected
    } else if (type === "status") {
      setStatus(value === "all" ? null : value); // Reset to null if "all" selected
    }
  };
  return (
    <div className="p-6">
      <Card className="shadow-xl border-0">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl text-[#243460]">
            All Inquiries
          </CardTitle>
          <div className="flex flex-wrap gap-2 items-center">
            <Input
              placeholder="Search customer name/contact"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Select value={source} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PHONE">Phone</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                <SelectItem value="MANUAL">Manual</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FOLLOWED_UP">Followed Up</SelectItem>
                <SelectItem value="CONVERTED">Converted</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>{" "}
            <Link href={"/inquiry/new"}>
              <Button className="">
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100 text-left">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-2 font-medium text-gray-700"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
