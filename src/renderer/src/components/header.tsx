import { Button } from '@renderer/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@renderer/components/ui/dialog";
import { trpc } from '@renderer/lib/trpc';
import { BadgeAlert, BadgeCheck, Folder, Settings } from 'lucide-react';

export function Header() {
    const { mutate: patch, isLoading: isPatching } = trpc.patch.useMutation({
        onSuccess: () => {
            utils.isPatched.invalidate();
            utils.isPatched.fetch();
            launch();
        }
    });
    const { mutate: launch } = trpc.launch.useMutation();
    const { mutate: openModsFolder } = trpc.openModsFolder.useMutation();
    const utils = trpc.useUtils();
    const { data: isPatched } = trpc.isPatched.useQuery();

    const handleLaunch = () => {
        if (!isPatched) {
            return; // Dialog will handle this case
        }
        launch();
    };

    return <header className='flex items-center px-4 pt-4 w-full max-w-7xl'>
        <div className='flex flex-row gap-x-4'>
            <h1 className='w-full text-2xl font-bold min-w-fit text-nowrap'>Deadlock Mod Manager</h1>

            <div
                className='inline-flex justify-center items-center py-2 h-10 text-sm font-medium whitespace-nowrap rounded-md transition-colors ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
            >

                {isPatched ? <p className='flex flex-row gap-2 items-center'><BadgeCheck className='w-4 h-4 text-green-500' /> Patched</p> :
                    <p className='flex flex-row gap-2 items-center'><BadgeAlert className='w-4 h-4 text-red-500' /> Not Patched</p>}
            </div>
        </div>

        <div className="flex gap-2 justify-end w-full">

            <Button variant="ghost" size='icon'>
                <Settings className='w-5 h-5' />
            </Button>
            <Button
                onClick={() => openModsFolder()}
                variant="outline"
            >
                <Folder className="mr-2 w-4 h-4" />
                Mods
            </Button>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        onClick={handleLaunch}
                    >
                        Launch
                    </Button>
                </DialogTrigger>
                {!isPatched && (
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Game Not Patched</DialogTitle>
                            <DialogDescription>
                                You need to patch the game before you can launch it with mods. Would you like to patch it now?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => patch()}>
                                {isPatching ? 'Patching...' : 'Patch Game'}
                            </Button>
                        </div>
                    </DialogContent>
                )}
            </Dialog>

        </div>
    </header>
}
