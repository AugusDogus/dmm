# Deadlock Mod Manager

A simple mod manager for [Deadlock](https://store.steampowered.com/app/1422450/Deadlock/), built with Electron, React, and TypeScript.

## Features

- [x] Browse mods from GameBanana
- [x] Sort mods by views and likes
- [x] Filter mods by category
- [x] Automatic game path detection
- [ ] Simple mod installation

## Development

### Prerequisites

- [Bun](https://bun.sh) for package management
- [Node.js](https://nodejs.org) 16 or higher

### Setup

```bash
#Install dependencies
bun install
```

```bash
#Start development server
bun dev
```

```bash
#Build for specific platforms
bun build:win # Windows
bun build:mac # macOS
bun build:linux # Linux
```
### Tech Stack

- [Electron](https://www.electronjs.org/) - Cross-platform desktop apps
- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [TanStack Router](https://tanstack.com/router) - Type-safe routing
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Vite](https://vitejs.dev/) - Fast build tool
- [electron-vite](https://electron-vite.org/) - Electron integration for Vite

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)