"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlusCircle,
  FileDown,
  ChevronLeft,
  ChevronRight,
  PlusCircleIcon,
} from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CreateCustomer from "./new-cust";

export default function CustomerTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState("");


  
  const columns = useMemo(
    () => [
      {
        header: "Client ID",
        accessorKey: "clientId",
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => (
          <Link href={`/customers/${row.original.id}`}>
            <span style={{ color: 'blue', textDecoration: 'underline' }}>
              {row.original.name}
            </span>
          </Link>
        ),
      },
      {
        header: "Address",
        accessorKey: "address",
      },
      {
        header: "City",
        accessorKey: "city",
      },
      {
        header: "Mobile",
        accessorKey: "mobile",
      },
      {
        header: "Phone",
        accessorKey: "phone",
      },
      {
        header: "Active",
        accessorKey: "active",
        cell: ({ row }) => (row.original.active === "Y" ? "Yes" : "No"),
      },
    ],
    []
  );
  

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) =>
      row
        .getValue(columnId)
        ?.toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase()),
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "customers.xlsx");
  };

  return (
    <div className="p-6">
      <Card className="shadow-xl border-0">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
          <CardTitle className="text-2xl text-[#243460]">
            Customers List
          </CardTitle>
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <Input
              placeholder="Search name, mobile, address"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-64"
            />
            <Button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700"
            >
              <FileDown className="mr-2 h-4 w-4" /> Export
            </Button>
            <Link href={"/customers/new"}>
              {" "}
              <Button className="bg-primary hover:bg-primary">
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                New Customer
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto md:w-full w-[300px] ">
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

          {/* Pagination */}
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
