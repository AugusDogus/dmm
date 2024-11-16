import { trpc } from '@renderer/lib/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ipcLink } from 'electron-trpc/renderer';
import { useState } from 'react';
import superjson from 'superjson';

export const Route = createRootRoute({
    component: () => (
        <Layout>
            <Outlet />
            <TanStackRouterDevtools />
        </Layout>
    ),
})

const Layout = ({ children }: { children: React.ReactNode }) => {

    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
        },
    }));

    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [ipcLink()],
            transformer: superjson,
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    )
}