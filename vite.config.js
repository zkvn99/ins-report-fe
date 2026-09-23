import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxy = {
    '/api': {
      target: env.VITE_SPRING_PROXY_TARGET || 'http://localhost:8080',
      changeOrigin: true
    }
  }
  return {
    plugins: [vue()],
    build: {
      target: 'es2022',
      assetsInlineLimit: Number.MAX_SAFE_INTEGER,
      cssCodeSplit: false,
      sourcemap: true
    },
    server: {
      allowedHosts: [
        '.trycloudflare.com',
        'localhost'
      ],
      proxy: apiProxy
    },
    preview: {
      proxy: apiProxy
    }
  }
})
