"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function CreateProductPage({ data }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const [products, setProducts] = useState(data || []);
  const [showForm, setShowForm] = useState(false);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to add product");
      alert("Product created successfully!");
      setTitle("");
      setProducts((prev) => [...prev, result]); // add new product to table
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "No.",
        accessorKey: "no",
        cell: (info) => info.getValue(),
      },
      {
        header: "Title",
        accessorKey: "title",
        cell: (info) => info.getValue(),
      },
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return (
        typeof value === "string" &&
        value.toLowerCase().includes(filterValue.toLowerCase())
      );
    },
  });

  return (
    <div className=" px-6 py-10 min-h-screen">
      <div className="flex justify-end">
        <Button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-primary hover:bg-blue-700"
        >
          {showForm ? "Hide Form" : "Add Product"}
        </Button>
      </div>

      {showForm && (
        <Card className="w-full max-w-3xl mb-8 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#243460]">
              Add Product
            </CardTitle>
            <CardDescription className="text-center">
              Create a product using the form below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Product Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-blue-700"
              >
                {loading ? "Saving..." : "Create Product"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div>
        {" "}
        <Card className="w-full max-w-5xl border-0 shadow-xl">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl text-[#243460]">
                All Products
              </CardTitle>
              <CardDescription>
                List of all products with search
              </CardDescription>
            </div>
            <Input
              placeholder="Search by title..."
              className="max-w-xs"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-2 text-left font-semibold"
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
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="p-4 text-center text-muted-foreground"
                      >
                        No products found
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-b hover:bg-accent/30">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-2">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
