import { Header } from '@renderer/components/header'
import { ModList } from '@renderer/components/mod-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mods')({
  component: Mods,
})

function Mods() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header />
      <ModList />
    </div>
  )
}
