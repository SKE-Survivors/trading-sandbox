import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  // ! note
  console.log("env", env);
  console.log("process.env", process.env);

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    base: "./",
    server: {
      host: "0.0.0.0",
      port: parseInt(process.env.PORT) || parseInt(env.VITE_PORT) || 5173,
    },
  };
});
