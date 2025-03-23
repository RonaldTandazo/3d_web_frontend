import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    define: {
      'process.env': process.env,
    },
    optimizeDeps: {
      include: ['crypto-browserify'],
    },
    server: {
      port: Number(env.VITE_PORT) || 5173,
    },
    plugins: [react(), tsconfigPaths()]
  };
});
