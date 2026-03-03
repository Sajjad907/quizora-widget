// vite.config.js
import { defineConfig } from "file:///C:/Users/Hp/Documents/quiz-recommendation-platform/legacy-v1/widget/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Hp/Documents/quiz-recommendation-platform/legacy-v1/widget/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///C:/Users/Hp/Documents/quiz-recommendation-platform/legacy-v1/widget/node_modules/@tailwindcss/vite/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\Hp\\Documents\\quiz-recommendation-platform\\legacy-v1\\widget";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html"),
        widget: resolve(__vite_injected_original_dirname, "src/EmbedBundle.jsx")
        // Create a separate entry for the widget
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxIcFxcXFxEb2N1bWVudHNcXFxccXVpei1yZWNvbW1lbmRhdGlvbi1wbGF0Zm9ybVxcXFxsZWdhY3ktdjFcXFxcd2lkZ2V0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxIcFxcXFxEb2N1bWVudHNcXFxccXVpei1yZWNvbW1lbmRhdGlvbi1wbGF0Zm9ybVxcXFxsZWdhY3ktdjFcXFxcd2lkZ2V0XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9IcC9Eb2N1bWVudHMvcXVpei1yZWNvbW1lbmRhdGlvbi1wbGF0Zm9ybS9sZWdhY3ktdjEvd2lkZ2V0L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdGFpbHdpbmRjc3MoKSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBtYWluOiByZXNvbHZlKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKSxcbiAgICAgICAgd2lkZ2V0OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9FbWJlZEJ1bmRsZS5qc3gnKSAvLyBDcmVhdGUgYSBzZXBhcmF0ZSBlbnRyeSBmb3IgdGhlIHdpZGdldFxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0uanMnLFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5bZXh0XSdcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlZLFNBQVMsb0JBQW9CO0FBQ3RhLE9BQU8sV0FBVztBQUNsQixPQUFPLGlCQUFpQjtBQUN4QixTQUFTLGVBQWU7QUFIeEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE1BQU0sUUFBUSxrQ0FBVyxZQUFZO0FBQUEsUUFDckMsUUFBUSxRQUFRLGtDQUFXLHFCQUFxQjtBQUFBO0FBQUEsTUFDbEQ7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
