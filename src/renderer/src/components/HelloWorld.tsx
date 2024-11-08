import { trpc } from '@renderer/App';

export function HelloWorld() {
    const { data, isLoading } = trpc.greeting.useQuery({ name: 'World' });
    const { data: paths } = trpc.steam.useQuery();

    if (isLoading) return <div>Loading...</div>;
    if (!data) return <div>Error</div>;

    return <p>{data.text} {paths?.paths?.game?.path}</p>
}