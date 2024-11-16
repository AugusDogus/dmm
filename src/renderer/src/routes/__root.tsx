import { trpc } from '@renderer/lib/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ipcLink } from 'electron-trpc/renderer';
import { lazy, useState } from 'react';
import superjson from 'superjson';

const TanStackRouterDevtools =
    process.env.NODE_ENV === 'production'
        ? () => null // Render nothing in production
        : lazy(() =>
            import('@tanstack/router-devtools').then((module) => ({
                default: module.TanStackRouterDevtools,
            }))
        );

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