import { createContext, FC, ReactNode, useContext } from "react";
import { FetchConfigType } from "../utils/fetchConfig";


export const FetchContext = createContext<FetchConfigType | undefined>(
  undefined
);
export const FetchWrapper: FC<{
  children?: ReactNode;
  client: FetchConfigType;
}> = ({ children, client }) => {
  return (
    <FetchContext.Provider value={client}>{children}</FetchContext.Provider>
  );
};

// Custom hook to access the MapContext
export const useFetchContext = () => {
  const context = useContext(FetchContext);
  if (!context) {
    throw new Error("Cannot use Context ouside of the Provider!");
  }
  return context;
};
