import { HelloWorld } from '@renderer/components/HelloWorld';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact } from '@trpc/react-query';
import { ipcLink } from 'electron-trpc/renderer';
import { ArrowRight } from 'lucide-react';
import { FC, useState } from 'react';
import superjson from 'superjson';
import type { AppRouter } from '../../main/api';
import { Button } from './components/ui/button';

export const trpc = createTRPCReact<AppRouter>();

const App: FC = () => {

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [ipcLink()],
      transformer: superjson,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col justify-center items-center px-5 space-y-8 w-full h-screen">
          <h1 className="text-5xl font-bold text-center">
            Electron-Vite template with ShadcnUI and Tailwindcss
          </h1>
          <p className="text-lg font-semibold">Start edit code in `src/rerender/src/App.tsx`</p>
          <Button asChild>
            <a href="/" className="flex gap-2">
              <HelloWorld />
              <ArrowRight />
            </a>
          </Button>
        </div>
      </QueryClientProvider>
    </trpc.Provider>

  )
}

export default App
