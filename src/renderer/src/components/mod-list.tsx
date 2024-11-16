import { trpc } from '@renderer/lib/trpc';
import { memo, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';

type SortOption = 'likes' | 'views';
type FilterOption = 'all' | string;

export function ModList() {
    const [sort, setSort] = useState<SortOption>('views');
    const [categoryFilter, setCategoryFilter] = useState<FilterOption>('all');
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
            sort,
            category: categoryFilter === 'all' ? undefined : categoryFilter,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            initialCursor: 0,
            staleTime: 1000 * 60,
            keepPreviousData: true,
        }
    );

    const { data: categories = [] } = trpc.categories.useQuery();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (status === 'loading') return <LoadingSkeleton />;
    if (status === 'error') return <div>Error: {error.message}</div>;

    return (
        <div className="p-4 mx-auto space-y-4 w-full max-w-7xl">
            <div className="flex gap-4 mb-6">
                <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="views">Most Viewed</SelectItem>
                        <SelectItem value="likes">Most Liked</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by category..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {data.pages.map((page) =>
                    page.items.map((mod) => (
                        <Card key={mod.name} className="transition-shadow hover:shadow-lg">
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
                                        <span>👍 {mod.likes ?? 0}</span>
                                        <span>⬇️ {mod.downloads ?? 0}</span>
                                        <span>🔗 {mod.category}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div ref={ref} className="flex justify-center items-center h-8">
                {isFetchingNextPage && (
                    <div className="space-x-2">
                        <Skeleton className="inline-block w-2 h-2 rounded-full" />
                        <Skeleton className="inline-block w-2 h-2 rounded-full" />
                        <Skeleton className="inline-block w-2 h-2 rounded-full" />
                    </div>
                )}
            </div>
        </div>
    );
}

const LoadingSkeleton = memo(function LoadingSkeleton() {
    return (
        <div className="p-4 mx-auto space-y-4 w-full max-w-7xl">
            <div className="flex gap-4 mb-6">
                <div className="w-[180px]">
                    <Skeleton className="h-10 rounded-md" />
                </div>
                <div className="w-[180px]">
                    <Skeleton className="h-10 rounded-md" />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Card key={i} className="w-full">
                        <div className="overflow-hidden relative w-full h-48">
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
        </div>
    );
});