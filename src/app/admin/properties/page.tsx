// import React from 'react'

// const PropertiesPage = () => {
//   return (
//     <div className="bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-lg shadow">
//           <div className="px-6 py-5">
//             <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Manage your property listings
//             </p>
//           </div>
//           <hr className="border-gray-200" />
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {/* Property components will be mapped here */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PropertiesPage

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Plus, Pencil, Trash2, Search, ArrowUpDown, Star } from "lucide-react";

import { ROUTES } from "@/routes";
import { PropertyPurpose, PropertyStatus, PropertyType } from "@/enums/property.enum";
import { formatPrice } from "@/lib/price";
import { IProperty } from "@/models/property.model";

const STATUS_COLORS: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  sold: "bg-red-100 text-red-700",
  rented: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  reserved: "bg-purple-100 text-purple-700",
};

export default function AdminPropertiesPage() {
  const router = useRouter();

  const [data, setData] = useState<IProperty[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [purpose, setPurpose] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/properties", {
        params: {
          page,
          limit,
          search: debouncedSearch,
          purpose: purpose === "all" ? "" : purpose,
          type: type === "all" ? "" : type,
          status: status === "all" ? "" : status,
          sortBy,
          order,
          published: "all", // admin sees everything
        },
      });
      setData(res.data.properties);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, debouncedSearch, purpose, type, status, sortBy, order, limit]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    await axios.delete(`/api/properties/${id}`);
    fetchProperties();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Properties</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {total} properties total
          </p>
        </div>
        <Button onClick={() => router.push(ROUTES.ADMIN.PROPERTIES.NEW)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3 items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search title, city, area..."
              className="pl-9"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            />
          </div>

          <Select value={purpose} onValueChange={(v) => { setPage(1); setPurpose(v); }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Purposes</SelectItem>
              {Object.values(PropertyPurpose).map((p) => (
                <SelectItem key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={(v) => { setPage(1); setType(v); }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.values(PropertyType).map((t) => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => { setPage(1); setStatus(v); }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(PropertyStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Added</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="h-4 w-4 mr-1" />
            {order === "asc" ? "Asc" : "Desc"}
          </Button>

          <Select
            value={String(limit)}
            onValueChange={(v) => { setPage(1); setLimit(Number(v)); }}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>{n} rows</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Type / Purpose</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No properties found
                </TableCell>
              </TableRow>
            ) : (
              data.map((property) => (
                <TableRow key={property._id?.toString()}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {property.images?.[0]?.url ? (
                        <Image
                          src={property.images[0].url}
                          alt={property.title}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
                          {property.title?.[0]}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-medium text-sm">{property.title}</p>
                          {property.isFeatured && (
                            <Star size={12} className="text-primary fill-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {property.city}{property.area ? `, ${property.area}` : ""}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      <div className="capitalize">{property.type}</div>
                      <div className="text-muted-foreground capitalize text-xs">
                        For {property.purpose}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-semibold text-sm">
                    PKR {formatPrice(property.price)}
                    {property.isNegotiable && (
                      <span className="text-xs text-muted-foreground block">Negotiable</span>
                    )}
                  </TableCell>

                  <TableCell className="text-sm">
                    {property.areaSize} {property.areaUnit}
                    {property.bedrooms != null && (
                      <div className="text-xs text-muted-foreground">
                        {property.bedrooms} bed · {property.bathrooms} bath
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[property.status] || "bg-gray-100 text-gray-700"}`}>
                      {property.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${property.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {property.isPublished ? "Live" : "Draft"}
                    </span>
                  </TableCell>

                  <TableCell className="text-right space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => router.push(ROUTES.ADMIN.PROPERTIES.EDIT(property._id!.toString()))}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(property._id!.toString())}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => page > 1 && setPage(page - 1)} />
          </PaginationItem>
          <PaginationItem>
            <span className="px-4 text-sm text-muted-foreground">
              Page {page} of {totalPages || 1}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={() => page < totalPages && setPage(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

    </div>
  );
}