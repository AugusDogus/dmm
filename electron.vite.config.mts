import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: [
          '@hinw/vdf-parser',
          'electron-settings'
        ]
      }
    },
    resolve: {
      alias: {
        '@hinw/vdf-parser': resolve(__dirname, 'node_modules/@hinw/vdf-parser/dist/index.js')
      },
      conditions: ['import', 'module', 'node'],
      mainFields: ['module', 'main'],
      extensions: ['.js', '.mjs', '.ts', '.json']
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'node16',
        supported: { 
          'top-level-await': true 
        },
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      react(),
      TanStackRouterVite(),
    ]
  }
})
