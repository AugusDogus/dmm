import { trpc } from '@renderer/lib/trpc';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {

    // Fetch settings
    const { data: settings, isLoading } = trpc.settings.useQuery();

    if (isLoading) {
        return <div className="flex justify-center items-center w-full h-screen">
            <Loader2 className="w-10 h-10 text-black animate-spin" />
        </div>
    }

    if (!settings?.setupComplete) {
        return <Navigate to="/setup" />
    }
    
    return <Navigate to="/mods" />

}
