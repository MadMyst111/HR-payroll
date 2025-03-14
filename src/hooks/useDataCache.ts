import { useState, useEffect } from "react";

type CacheItem<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
};

interface CacheOptions {
  /** Cache expiration time in milliseconds */
  expirationTime?: number;
  /** Key to use for storing in cache */
  cacheKey?: string;
}

const DEFAULT_EXPIRATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheItem<any>>();

/**
 * Hook for caching data with automatic expiration
 * @param fetchFn Function that fetches the data
 * @param dependencies Dependencies array that triggers refetch
 * @param options Cache options
 */
export function useDataCache<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options: CacheOptions = {},
) {
  const { expirationTime = DEFAULT_EXPIRATION, cacheKey = "default-cache" } =
    options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Generate a unique cache key based on the provided key and dependencies
  const fullCacheKey = `${cacheKey}-${JSON.stringify(dependencies)}`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check if we have valid cached data
        const cachedItem = cache.get(fullCacheKey);
        const now = Date.now();

        if (cachedItem && now < cachedItem.expiresAt) {
          console.log(`Using cached data for ${fullCacheKey}`);
          setData(cachedItem.data);
          setLoading(false);
          return;
        }

        // Fetch fresh data
        console.log(`Fetching fresh data for ${fullCacheKey}`);
        const freshData = await fetchFn();

        // Store in cache
        cache.set(fullCacheKey, {
          data: freshData,
          timestamp: now,
          expiresAt: now + expirationTime,
        });

        setData(freshData);
      } catch (err) {
        console.error(`Error fetching data for ${fullCacheKey}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to remove expired cache items
    return () => {
      const now = Date.now();
      for (const [key, item] of cache.entries()) {
        if (now > item.expiresAt) {
          cache.delete(key);
        }
      }
    };
  }, [...dependencies]);

  const invalidateCache = () => {
    cache.delete(fullCacheKey);
  };

  return { data, loading, error, invalidateCache };
}

/**
 * Utility function to manually clear all cache or specific cache items
 * @param cacheKey Optional specific cache key to clear
 */
export function clearCache(cacheKey?: string) {
  if (cacheKey) {
    // Clear specific cache items that start with the provided key
    for (const key of cache.keys()) {
      if (key.startsWith(cacheKey)) {
        cache.delete(key);
      }
    }
  } else {
    // Clear all cache
    cache.clear();
  }
}
