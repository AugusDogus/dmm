import { Header } from '@renderer/components/header'
import { ModList } from '@renderer/components/mod-list'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div className="flex flex-col items-center w-full min-h-screen">
            <Header />
            <ModList />
        </div>

    )
}