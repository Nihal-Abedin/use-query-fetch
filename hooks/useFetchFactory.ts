import { useEffect, useState } from "react";
import { useFetch } from "./useFetch";
import { authFetch } from "./authFetch";
import { useFetchContext } from "./useFetchContext";


type CallbackOptions = {
    onSuccess?: (data: unknown) => void;
    onError?: (error: unknown) => void;
}
export const useQuery = (
    path: string,
    options?: CallbackOptions
) => {
    const { BASE_URL, ...restConfigOptions } = useFetchContext()
    const { data, error, isError, isLoading } = useFetch(path, { method: "GET", BASE_URL: BASE_URL, ...restConfigOptions });
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
export const useMutation = (
    path: string,
    options?: {
        method?: "POST" | "PATCH" | "PUT" | "DELETE";
        BASE_URL?: string;
    }
) => {
    const { BASE_URL } = useFetchContext()

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const doMutation = async (payload, callbacks?: CallbackOptions) => {
        setIsLoading(true);
        try {
            const res = await authFetch(path, { body: payload, method: "POST", BASE_URL: BASE_URL, ...options });
            if (!res.ok) {
                throw res;
            }
            const resData = await res.json();
            setData(resData);
            callbacks?.onSuccess(resData)
        } catch (err) {
            const errRes = await err.json();
            setError(errRes);
            setIsError(true);
            callbacks.onError(errRes)
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
