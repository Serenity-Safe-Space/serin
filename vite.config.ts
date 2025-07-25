import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Prevent caching issues in development
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Force reload on file changes
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Ensure proper source maps for debugging
  build: {
    sourcemap: mode === 'development',
    // Add timestamp to build for cache busting
    rollupOptions: {
      output: {
        entryFileNames: mode === 'production' ? 'assets/[name]-[hash].js' : 'assets/[name].js?t=' + Date.now(),
        chunkFileNames: mode === 'production' ? 'assets/[name]-[hash].js' : 'assets/[name].js?t=' + Date.now(),
        assetFileNames: mode === 'production' ? 'assets/[name]-[hash].[ext]' : 'assets/[name].[ext]?t=' + Date.now(),
      }
    }
  },
  // Prevent aggressive caching
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  }
}));
