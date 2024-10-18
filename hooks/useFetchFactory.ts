import { useEffect, useState } from "react";
import { useFetch } from "./useFetch";
import { useFetchContext } from "./useFetchContext";


type CallbackOptions = {
    onSuccess?: (data: unknown) => void;
    onError?: (error: unknown) => void;
};
export interface QueryProperties {
    queryKey: string;
    queryFn: (payload?: unknown) => Promise<Response>;
}
export const useQuery = <T>(
    queryOptions: QueryProperties,
    options?: CallbackOptions
) => {
    const clientConfig = useFetchContext();
    const { data, error, isError, isLoading } = useFetch<T>(queryOptions, {
        method: "GET",
        ...clientConfig,
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
export const useMutation = <P>(
    queryOptions: { queryFn: (payload: P) => Promise<Response> },
) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const doMutation = async (payload: P, callbacks?: CallbackOptions) => {
        setIsLoading(true);
        try {
            const res = await queryOptions.queryFn(payload);
            const resData = await res.json();
            setData(resData);
            if (callbacks?.onSuccess) {
                callbacks.onSuccess(resData);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
                setIsError(true);
                return
            }
            const errRes = await err.json();
            setError(errRes);
            setIsError(true);
            if (callbacks?.onError) {
                callbacks.onError(errRes);
            }
        } finally {
            setIsLoading(false);
        }
    };
    return {
        mutate: doMutation,
        error,
        data,
        isLoading,
        isError,
    };
};
