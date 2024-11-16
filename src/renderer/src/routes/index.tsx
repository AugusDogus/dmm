import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    const router = useRouter()

    setTimeout(() => {
        router.navigate({
            to: '/mods',
            viewTransition: true,
        })
    }, 5000)

    return (
        <div className="flex justify-center items-center w-full h-screen">
            <Loader2 className="w-10 h-10 text-black animate-spin" />
        </div>
    )
}
