import { createContext, ReactNode, useContext } from "react";
import type { FetchConfigType } from "../utils/fetchConfig.ts";

/**
 * Context to provide fetch configuration options.
 * @type {React.Context<FetchConfigType | undefined>}
 */
export const FetchContext = createContext<FetchConfigType | undefined>(
  undefined
);

/**
 * Props for the FetchWrapper component.
 * @interface FetchWrapperProps
 * @property {ReactNode} children - The children components to be rendered inside the provider.
 * @property {FetchConfigType} client - The fetch configuration object.
 */
interface FetchWrapperProps {
  children: ReactNode;
  client: FetchConfigType;
}

/**
 * FetchWrapper component to provide fetch configuration to children components via context.
 *
 * @param {FetchWrapperProps} props - The properties object, including children and client.
 * @returns {JSX.Element} The provider component wrapping the children with fetch context.
 */
export const FetchWrapper = ({ children, client }: FetchWrapperProps) => {
  return (
    <FetchContext.Provider value={client}>{children}</FetchContext.Provider>
  );
};

/**
 * Custom hook to access the FetchContext.
 *
 * @throws Will throw an error if the hook is used outside the FetchContext provider.
 * @returns {FetchConfigType} The fetch configuration object from the context.
 */
export const useFetchContext = (): FetchConfigType => {
  const context = useContext(FetchContext);
  if (!context) {
    throw new Error("Cannot use FetchContext outside of the Provider!");
  }
  return context;
};
