import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact } from '@trpc/react-query';
import { ipcLink } from 'electron-trpc/renderer';
import { FC, useState } from 'react';
import superjson from 'superjson';
import type { AppRouter } from '../../main/api';
import { ModList } from './components/ModList';

export const trpc = createTRPCReact<AppRouter>();

const App: FC = () => {

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
        <div className="flex flex-col items-center w-full min-h-screen">
          <ModList />
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App
