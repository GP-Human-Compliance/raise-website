import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({
            fallback: 'index.html'
        }),
        // Mark path non-relative, otherwise SvelteKit assumes it works in a sub-directory
        paths: {
            relative: false
        }
    },
    compilerOptions: {
        // disable all warnings coming from node_modules and all accessibility warnings
        warningFilter: (warning) => {
            return warning.code.includes("ally_");
        },
    },
};

export default config;
