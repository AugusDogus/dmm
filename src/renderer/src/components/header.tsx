import { Button } from '@renderer/components/ui/button';
import { trpc } from '@renderer/lib/trpc';

// TODO: Disable the launch button if the game is not patched

export function Header() {
    const { mutate: patch } = trpc.patch.useMutation();
    const { mutate: launch } = trpc.launch.useMutation();

    return <header className='flex items-center px-4 pt-4 w-full max-w-7xl'>
        <h1 className='w-full text-2xl font-bold'>Deadlock Mod Manager</h1>
        <div className="flex gap-2 justify-end w-full">
            <Button onClick={() => patch()} variant="outline">Patch</Button>
            <Button onClick={() => launch()}>Launch Modded</Button>
        </div>
    </header>
}
