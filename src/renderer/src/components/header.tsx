import { Button } from '@renderer/components/ui/button';

export function Header() {
    return <header className='flex items-center px-4 pt-4 w-full'>
        <h1 className='w-full text-2xl font-bold'>Deadlock Mod Manager</h1>
        <div className="flex gap-2 justify-end w-full">
            <Button variant="outline">Patch</Button>
            <Button>Launch Modded</Button>
        </div>
    </header>
}
