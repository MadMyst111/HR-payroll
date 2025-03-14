import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { exportToCSV, exportToExcel } from "@/utils/exportUtils";
import { useLazyLoad } from "@/hooks/useLazyLoad";

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  title?: string;
  exportFilename?: string;
  isRTL?: boolean;
  pageSize?: number;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchFields,
  title,
  exportFilename = "export",
  isRTL = false,
  pageSize = 10,
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isSaveSearchOpen, setIsSaveSearchOpen] = useState(false);
  const [savedSearchName, setSavedSearchName] = useState("");
  const [savedSearches, setSavedSearches] = useState<
    { id: string; name: string }[]
  >([]);

  // Filter data based on search term and filters
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      // Apply search term filter
      if (searchTerm && searchFields && searchFields.length > 0) {
        const matches = searchFields.some((field) => {
          const value = item[field];
          return (
            value &&
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
        if (!matches) return false;
      }

      // Apply column filters
      for (const [key, value] of Object.entries(filters)) {
        if (value && String(item[key]) !== String(value)) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchTerm, filters, searchFields]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Implement lazy loading
  const { visibleItems, hasMore, isLoading, loadMore } = useLazyLoad(
    sortedData,
    {
      initialBatchSize: pageSize,
      batchSize: pageSize,
    },
  );

  // Handle sorting
  const handleSort = (key: keyof T) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        if (prevConfig.direction === "asc") {
          return { key, direction: "desc" };
        } else if (prevConfig.direction === "desc") {
          return { key: null, direction: null };
        }
      }
      return { key, direction: "asc" };
    });
  };

  // Handle export
  const handleExport = (type: "csv" | "excel") => {
    if (type === "csv") {
      exportToCSV(sortedData, exportFilename);
    } else {
      exportToExcel(sortedData, exportFilename);
    }
  };

  // Save search
  const handleSaveSearch = () => {
    if (!savedSearchName.trim()) return;

    const newSearch = {
      id: Date.now().toString(),
      name: savedSearchName,
    };

    const updatedSearches = [...savedSearches, newSearch];
    setSavedSearches(updatedSearches);

    // Save to localStorage
    localStorage.setItem("savedSearches", JSON.stringify(updatedSearches));

    setIsSaveSearchOpen(false);
    setSavedSearchName("");
  };

  // Load saved searches from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("savedSearches");
    if (saved) {
      try {
        setSavedSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading saved searches:", e);
      }
    }
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Header with title and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {title && <h2 className="text-xl font-semibold">{title}</h2>}

        <div className="flex flex-wrap gap-2">
          {/* Search input */}
          <div className="relative">
            <Search
              className={`absolute ${isRTL ? "right-2" : "left-2"} top-2.5 h-4 w-4 text-muted-foreground search-icon`}
            />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-[200px] ${isRTL ? "pr-8 text-right" : "pl-8 text-left"}`}
            />
          </div>

          {/* Save search button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSaveSearchOpen(true)}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Search
          </Button>

          {/* Export dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Saved searches */}
      {savedSearches.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Saved searches:</span>
          {savedSearches.map((search) => (
            <Button key={search.id} variant="ghost" size="sm">
              {search.name}
            </Button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.accessorKey)}
                  className={
                    column.sortable ? "cursor-pointer select-none" : ""
                  }
                  onClick={
                    column.sortable
                      ? () => handleSort(column.accessorKey)
                      : undefined
                  }
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable &&
                      sortConfig.key === column.accessorKey &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.length > 0 ? (
              visibleItems.map((item, index) => (
                <TableRow
                  key={index}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                  }
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                >
                  {columns.map((column) => (
                    <TableCell key={String(column.accessorKey)}>
                      {column.cell
                        ? column.cell(item)
                        : String(item[column.accessorKey] || "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={loadMore} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {/* Save search dialog */}
      <Dialog open={isSaveSearchOpen} onOpenChange={setIsSaveSearchOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Search</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={savedSearchName}
                onChange={(e) => setSavedSearchName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveSearch}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
