import { useEffect, useState } from "react";
import { useFetch } from "./useFetch";
import { useFetchContext } from "./useFetchContext";
import type { FetchConfigType } from "../utils/fetchConfig";


interface CallbackOptions<T = unknown> {
    onSuccess?: (data: T) => void;
    onError?: (error: unknown) => void;
}

interface UseQueryResult<T> {
    data: T | null;
    error: unknown | null;
    isError: boolean;
    isLoading: boolean;
}

export interface QueryProperties {
    queryKey: string;
    queryFn: (payload?: unknown) => Promise<Response>;
}
export const useQuery = <T>(
    queryOptions: QueryProperties & { config?: FetchConfigType },
    options?: CallbackOptions<T>
): UseQueryResult<T> => {
    const clientConfig = useFetchContext();
    const { config: customConfig = {} } = queryOptions
    const { data, error, isError, isLoading } = useFetch<T>(queryOptions, {
        method: "GET",
        ...clientConfig,
        ...customConfig
    });
    useEffect(() => {
        if (options?.onSuccess && data) {
            options.onSuccess(data);
        }
        if (options?.onError && error) {
            options.onError(error);
        }
    }, [data, error, options]);
    return { data, error, isError, isLoading };
};
interface UseMutationResult<P, R> {
    data: R | null;
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    doMutation: (payload: P, callbacks?: CallbackOptions<T>) => Promise<void>;
}

/**
 * Custom hook for handling mutations (POST, PUT, PATCH, DELETE) with Fetch API.
 *
 * @template P - Type of the payload for the mutation function.
 * @template R - Type of the data returned by the API.
 * @param {Object} queryOptions - Object containing the mutation function (`queryFn`) that returns a promise.
 * @param {(payload: P) => Promise<Response>} queryOptions.queryFn - The function to execute the mutation.
 * @returns {Object} An object containing the mutation result, loading status, error status, and a function to trigger the mutation.
 */
export const useMutation = <P, R = unknown>(queryOptions: {
    queryFn: (payload: P) => Promise<Response>;
}): UseMutationResult<P, R> => {
    const [data, setData] = useState<R | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Perform the mutation
    const doMutation = async (payload: P, callbacks?: CallbackOptions<R>): Promise<void> => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
            const res = await queryOptions.queryFn(payload);
            const resData = await res.json();
            setData(resData);
            if (callbacks?.onSuccess) {
                callbacks.onSuccess(resData);
            }
        } catch (err) {
            setIsError(true);
            if (err instanceof Error) {
                setError(err.message);
                if (callbacks?.onError) {
                    callbacks.onError(err.message);
                }
            } else if (err instanceof Response) {
                const errRes = await err.json();
                setError(JSON.stringify(errRes));
                if (callbacks?.onError) {
                    callbacks.onError(errRes);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { data, isLoading, isError, error, doMutation };
};
