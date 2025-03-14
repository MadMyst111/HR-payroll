import { useState, useEffect, useCallback } from "react";

interface SearchOptions<T> {
  /** Fields to search in */
  searchFields: (keyof T)[];
  /** Case sensitive search */
  caseSensitive?: boolean;
  /** Match whole words only */
  wholeWord?: boolean;
  /** Custom filter function for advanced filtering */
  customFilter?: (item: T, searchTerm: string) => boolean;
}

interface SavedSearch {
  id: string;
  name: string;
  searchTerm: string;
  filters: Record<string, any>;
  timestamp: number;
}

/**
 * Hook for advanced search functionality
 * @param items Array of items to search
 * @param options Search configuration options
 */
export function useAdvancedSearch<T>(items: T[], options: SearchOptions<T>) {
  const {
    searchFields,
    caseSensitive = false,
    wholeWord = false,
    customFilter,
  } = options;

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  // Load saved searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedSearches");
    if (saved) {
      try {
        setSavedSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading saved searches:", e);
      }
    }
  }, []);

  // Filter items based on search term and filters
  const filterItems = useCallback(() => {
    if (!searchTerm && Object.keys(filters).length === 0) {
      return items;
    }

    return items.filter((item) => {
      // Apply custom filter if provided
      if (customFilter && !customFilter(item, searchTerm)) {
        return false;
      }

      // Apply search term filtering
      if (searchTerm) {
        const searchValue = caseSensitive
          ? searchTerm
          : searchTerm.toLowerCase();

        // Check if any of the specified fields match the search term
        const matchesSearchTerm = searchFields.some((field) => {
          const fieldValue = String(item[field] || "");
          const valueToCheck = caseSensitive
            ? fieldValue
            : fieldValue.toLowerCase();

          if (wholeWord) {
            // Match whole words only
            const words = valueToCheck.split(/\s+/);
            return words.includes(searchValue);
          } else {
            // Partial match
            return valueToCheck.includes(searchValue);
          }
        });

        if (!matchesSearchTerm) return false;
      }

      // Apply additional filters
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== "") {
          if (item[key as keyof T] !== value) {
            return false;
          }
        }
      }

      return true;
    });
  }, [
    items,
    searchTerm,
    filters,
    searchFields,
    caseSensitive,
    wholeWord,
    customFilter,
  ]);

  // Update filtered items when dependencies change
  useEffect(() => {
    setFilteredItems(filterItems());
  }, [filterItems]);

  // Save a search for future use
  const saveSearch = (name: string) => {
    if (!name.trim()) return;

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      searchTerm,
      filters,
      timestamp: Date.now(),
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem("savedSearches", JSON.stringify(updated));

    return newSearch.id;
  };

  // Load a saved search
  const loadSearch = (searchId: string) => {
    const search = savedSearches.find((s) => s.id === searchId);
    if (search) {
      setSearchTerm(search.searchTerm);
      setFilters(search.filters);
      return true;
    }
    return false;
  };

  // Delete a saved search
  const deleteSearch = (searchId: string) => {
    const updated = savedSearches.filter((s) => s.id !== searchId);
    setSavedSearches(updated);
    localStorage.setItem("savedSearches", JSON.stringify(updated));
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filteredItems,
    savedSearches,
    saveSearch,
    loadSearch,
    deleteSearch,
  };
}
