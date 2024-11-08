import { trpc } from '@renderer/App';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface Mod {
    id: number;
    name: string;
    author: string;
    likes: number | undefined;
    views: number;
    category: string;
    previewImage?: string;
}

export function ModList() {
    const { ref, inView } = useInView();

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = trpc.infiniteMods.useInfiniteQuery(
        {
            limit: 10,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            initialCursor: 0,
        }
    );

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (status === 'loading') return <LoadingSkeleton />;
    if (status === 'error') return <div>Error: {error.message}</div>;

    return (
        <div className="p-4 mx-auto space-y-4 w-full max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold">Available Mods</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {data.pages.map((page) =>
                    page.items.map((mod: Mod) => (
                        <Card key={mod.id} className="transition-shadow hover:shadow-lg">
                            {mod.previewImage && (
                                <div className="overflow-hidden relative w-full h-48">
                                    <img
                                        src={mod.previewImage}
                                        alt={mod.name}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-xl">{mod.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">By {mod.author}</p>
                                    <div className="flex justify-between text-sm">
                                        <span>👍 {mod.likes}</span>
                                        <span>👀 {mod.views}</span>
                                        <span>🔗 {mod.category}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div ref={ref} className="flex justify-center items-center h-8">
                {isFetchingNextPage && <LoadingSkeleton />}
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="w-full">
                    <div className="w-full h-48">
                        <Skeleton className="w-full h-full" />
                    </div>
                    <CardHeader>
                        <Skeleton className="w-3/4 h-6" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Skeleton className="w-1/2 h-4" />
                            <div className="flex justify-between">
                                <Skeleton className="w-16 h-4" />
                                <Skeleton className="w-16 h-4" />
                                <Skeleton className="w-16 h-4" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}