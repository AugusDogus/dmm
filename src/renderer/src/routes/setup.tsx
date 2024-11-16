import { Button } from '@renderer/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@renderer/components/ui/select';
import { trpc } from '@renderer/lib/trpc';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/setup')({
  component: RouteComponent,
})

function RouteComponent() {

  const { data: paths } = trpc.steam.useQuery();
  const { mutate: setPath } = trpc.setSteamPath.useMutation();
  const { mutate: completeSetup } = trpc.completeSetup.useMutation();

  const router = useRouter();

  return (
    <div className='flex flex-col justify-between items-center p-10 h-screen'>
      <div className='flex flex-col gap-y-10 items-center'>
        <h1 className='text-2xl font-bold'>Setup</h1>
        <Select onValueChange={(path) => setPath({ path })}>
          <SelectTrigger className="max-w-xl text-white dark">
            <SelectValue placeholder={paths?.[0] ?? 'Select installation path'} />
          </SelectTrigger>
          <SelectContent>
            {paths?.length === 0 && <SelectItem value="none">No paths found</SelectItem>}
            {paths?.map((path) => (
              <SelectItem key={path} value={path}>{path}</SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>
      <div className='flex gap-x-2 justify-end w-full'>
        <Button onClick={() => {
          completeSetup();
          router.navigate({ to: '/mods' })
        }}>Next <ChevronRight /></Button>
      </div>
    </div >
  )
}
