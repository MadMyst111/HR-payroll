import { useState, useEffect, useCallback } from "react";

interface LazyLoadOptions<T> {
  /** Initial batch size */
  initialBatchSize?: number;
  /** Subsequent batch size */
  batchSize?: number;
  /** Function to filter items */
  filterFn?: (item: T) => boolean;
  /** Function to sort items */
  sortFn?: (a: T, b: T) => number;
}

/**
 * Hook for lazy loading data in batches
 * @param items Full array of items
 * @param options Configuration options
 */
export function useLazyLoad<T>(items: T[], options: LazyLoadOptions<T> = {}) {
  const { initialBatchSize = 20, batchSize = 10, filterFn, sortFn } = options;

  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Process the items with filtering and sorting
  const processedItems = useCallback(() => {
    let result = [...items];

    // Apply filtering if provided
    if (filterFn) {
      result = result.filter(filterFn);
    }

    // Apply sorting if provided
    if (sortFn) {
      result = result.sort(sortFn);
    }

    return result;
  }, [items, filterFn, sortFn]);

  // Initialize with the first batch
  useEffect(() => {
    const processed = processedItems();
    setVisibleItems(processed.slice(0, initialBatchSize));
    setHasMore(processed.length > initialBatchSize);
  }, [processedItems, initialBatchSize]);

  // Function to load more items
  const loadMore = useCallback(() => {
    setIsLoading(true);

    // Simulate async loading
    setTimeout(() => {
      const processed = processedItems();
      const currentSize = visibleItems.length;
      const newItems = processed.slice(0, currentSize + batchSize);

      setVisibleItems(newItems);
      setHasMore(newItems.length < processed.length);
      setIsLoading(false);
    }, 300);
  }, [visibleItems, processedItems, batchSize]);

  return { visibleItems, hasMore, isLoading, loadMore };
}
