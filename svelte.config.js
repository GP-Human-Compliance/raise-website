import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// Subpath when deployed at <user>.github.io/<repo>/ (no custom domain).
// Drop to '' once DNS points www.raise-app.de at GH Pages and a CNAME file
// is in static/ — at that point the site lives at the apex.
const basePath = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({
            fallback: 'index.html'
        }),
        paths: {
            base: basePath,
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
