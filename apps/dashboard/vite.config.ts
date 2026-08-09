import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

function nativeModules(): Plugin {
  return {
    name: "native-modules",
    enforce: "pre",
    resolveId(source) {
      if (source.endsWith(".node")) {
        return { id: "\0native:" + source, moduleSideEffects: false };
      }
    },
    load(id) {
      if (id.startsWith("\0native:") || id.endsWith(".node")) {
        return "export default {}";
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  base: mode === "production" || command === "build" ? "/dashboard/" : "/",
  plugins: [nativeModules(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
