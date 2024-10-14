import { useState, useEffect, useCallback } from "react";
import { getFromCache, setToCache } from "./cache"; // Implement these cache functions
import { authFetch } from "./authFetch";
import { useWindowFocus } from "./useWindowFocus";
import { FetchConfigType } from "../utils/fetchConfig";
export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: string | FormData;
  headers?: HeadersInit;
}
export const useFetch = (
  requestUrl: string,
  options?: RequestOptions & FetchConfigType
) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const isWindowFocused = useWindowFocus(); // Get window focus state
  const paramOptions: RequestOptions = {
    method: "GET",
    ...options,
    BASE_URL: options.BASE_URL,
  }
  const fetchData = useCallback(async (ignoreCache = false) => {

    const isGetMethod =
      paramOptions.method?.toUpperCase() === "GET" || !paramOptions.method;

    // Check cache for GET requests
    if (!ignoreCache && isGetMethod) {
      const cachedResponse = getFromCache(requestUrl);
      if (cachedResponse) {
        setData(JSON.parse(cachedResponse.body));
        setIsLoading(false);
        return;
      }
    }

    try {
      const customHeaders = { ...paramOptions.headers };
      // if (apiKey) {
      //     customHeaders['api-key'] = apiKey;
      // }

      const response = await authFetch(requestUrl, {
        method: paramOptions.method,
        headers: customHeaders,
        body: paramOptions.body,
        BASE_URL: paramOptions.BASE_URL
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);

      // Cache the GET response
      if (isGetMethod) {
        setToCache(requestUrl, {
          body: JSON.stringify(responseData),
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        }, options.cacheTime);
      }
    } catch (err) {
      const errRes = await err.json()
      setIsError(true);
      setError(errRes);
      console.error(errRes);
    } finally {
      setIsLoading(false);
    }
  }, [options.cacheTime, paramOptions.BASE_URL, paramOptions.body, paramOptions.headers, paramOptions.method, requestUrl]);

  // Trigger fetching when the component mounts or dependencies change
  useEffect(() => {
    fetchData();
    return () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

    }
  }, [fetchData]);
  useEffect(() => {
    if (!isWindowFocused && options.refetchOnWindowFocus) {
      fetchData(true); // Pass true to ignore cache when refetching
    }
  }, [isWindowFocused, fetchData, options.refetchOnWindowFocus]);

  return { data, isLoading, isError, error };
};
