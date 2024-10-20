import { FetchConfigType } from "../utils/fetchConfig.ts";
import { getFromCache } from "./cache.ts";
import type { QueryState } from "./useFetch.ts";
/**
 * FetchClient class for managing fetch requests, caching, and refetching queries.
 */
export class FetchClient {
    defaultOptions: FetchConfigType;

    /**
     * Initializes a new instance of FetchClient with optional configuration.
     *
     * @param {FetchConfigType} [config] - Optional configuration object for fetch settings.
     */
    constructor(config?: FetchConfigType) {
        this.defaultOptions = {
            cacheTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: true,
            ...config,
        };
    }

    /**
     * Retrieves cached query data by key.
     *
     * @param {string} key - The key for retrieving cached data.
     * @returns {any | undefined} The parsed cached data if found, otherwise undefined.
     */
    getQueryCacheData(key: string): any | undefined {
        const cache = getFromCache(key);
        if (cache?.body) {
            return JSON.parse(cache?.body);
        }
        return undefined;
    }

    /**
     * Refetches a query by key, updating the state of the query with new data or error.
     *
     * @param {string} key - The key for the query to be refetched.
     * @returns {Promise<void>} A promise that resolves once the query has been refetched.
     */
    async refetchQueries(key: string): Promise<void> {
        const cacheEntry = getFromCache(key);
        if (cacheEntry) {
            const { queryFn, setState } = cacheEntry;

            // Set loading state to true
            setState((prevState: QueryState<unknown>) => ({
                ...prevState,
                isLoading: true,
            }));

            try {
                const result = await queryFn();
                const data = await result.json();

                if (!result.ok) {
                    throw result;
                }

                // Set data and update loading/error states
                setState((prevState: QueryState<unknown>) => ({
                    ...prevState,
                    data,
                    isLoading: false,
                    isError: false,
                    error: null,
                }));
            } catch (err) {
                if (err instanceof Error) {
                    setState((prev: QueryState<unknown>) => ({
                        ...prev,
                        error: err.message,
                        isError: true,
                    }));
                    return;
                }

                if (err instanceof Response) {
                    const errRes = await err.json();
                    setState((prev: QueryState<unknown>) => ({
                        ...prev,
                        error: errRes,
                        isError: true,
                    }));
                }
            } finally {
                setState((prevState: QueryState<unknown>) => ({
                    ...prevState,
                    isLoading: false,
                }));
            }
        }
    }
}
