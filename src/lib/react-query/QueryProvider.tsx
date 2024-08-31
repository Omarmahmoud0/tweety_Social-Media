import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";


const queryClinet = new QueryClient()

export const QueryProvider = ({children}: {children: ReactNode}) => {
    return (
        <QueryClientProvider client={queryClinet}>
            {children}
        </QueryClientProvider>
    )
}