<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env,
  },
  optimizeDeps: {
    include: ['crypto-browserify'],
  },
  plugins: [react(), tsconfigPaths()],
})
=======
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
      port: Number(env.VITE_PORT) || 5173, // Usa el puerto del .env o el 5173 por defecto
    },
    plugins: [react(), tsconfigPaths()]
  };
});
>>>>>>> f403f36 (SignIn and SignUp Screen, AuthContext, Auth and Main Layout)
