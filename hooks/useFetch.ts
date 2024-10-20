import { useState, useEffect, useCallback } from "react";
import { getFromCache, setToCache } from "./cache"; // Implement these cache functions
import { useWindowFocus } from "./useWindowFocus";
import { FetchConfigType } from "../utils/fetchConfig";
import { QueryProperties } from "./useFetchFactory";
export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: string | FormData;
  headers?: HeadersInit;
  BASE_URL?: string;
}
export interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any | null;
}
/**
 * Custom hook for fetching data with caching, error handling, and refetch on window focus.
 *
 * @template T - The expected shape of the fetched data.
 * @param {QueryProperties} queryOptions - Object containing the function that performs the fetch and the query key.
 * @param {RequestOptions & FetchConfigType} [options] - Optional request and fetch configuration options.
 * @returns {QueryState<T>} An object containing the current state of the fetch (data, loading, error).
 */
export const useFetch = <T>(
  queryOptions: QueryProperties, // function that performs the fetch and returns the response or error
  options?: RequestOptions & FetchConfigType
) => {
  const { queryFn, queryKey } = queryOptions
  const [state, setState] = useState<QueryState<T>>({
    data: null as T | null,
    isLoading: true,
    isError: false,
    error: null,
  });
  const isWindowFocused = useWindowFocus(); // Get window focus state

  const fetchData = useCallback(async (ignoreCache = false) => {
    try {
      // Call the provided fetch function
      const req = await queryFn();
      const responseData = await req.json() as T
      // Handle GET request caching if applicable
      if (!ignoreCache && options?.method?.toUpperCase() === 'GET') {
        const cachedResponse = getFromCache(queryKey); // Use the fetch function's identity as a cache key
        if (cachedResponse) {
          
          setState(prev => ({ ...prev, data: JSON.parse(cachedResponse.body), isLoading: false }))
          return;
        }
      }

      setState(prev => ({ ...prev, data: responseData, isError: false }))

      // Cache the GET response if applicable
      if (options?.method?.toUpperCase() === 'GET') {
        setToCache(queryKey, {
          body: JSON.stringify(responseData),
          queryFn: queryFn,
          setState
        }, options.cacheTime);
      }

    } catch (err) {
      if (err instanceof Error) {
        setState(prev => ({ ...prev, error: err, isError: true }))

        return
      }
      const errRes = await err.json()
      setState(prev => ({ ...prev, error: errRes, isError: true }))

      console.error(errRes);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [options?.cacheTime, options?.method, queryFn, queryKey]);

  // Trigger fetching when the component mounts or dependencies change
  useEffect(() => {
    fetchData();
    return () => {
      setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }))
    };
  }, [fetchData]);

  // Handle refetch on window focus if needed
  useEffect(() => {
    if (isWindowFocused && options?.refetchOnWindowFocus) {
      fetchData(true); // Pass true to ignore cache when refetching
    }
  }, [isWindowFocused, fetchData, options?.refetchOnWindowFocus]);

  return { ...state };
};
