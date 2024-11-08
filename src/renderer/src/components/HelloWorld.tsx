import { trpc } from '@renderer/App';

export function HelloWorld() {
    const { data, isLoading } = trpc.greeting.useQuery({ name: 'World' });

    if (isLoading) return <div>Loading...</div>;
    if (!data) return <div>Error</div>;

    return <p>{data.text}</p>
}