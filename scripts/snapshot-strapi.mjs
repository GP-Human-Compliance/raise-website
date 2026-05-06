// One-shot snapshot of all Strapi content used by the site.
//
// Reads STRAPI_BASE_URL + STRAPI_TOKEN from env (defaults to the public token
// already baked into the live site), fetches every endpoint for DE + EN,
// downloads every referenced media file, rewrites all media URLs to local
// paths, and writes everything into src/lib/content/ + static/strapi-media/.
//
// Re-run any time content needs to be re-pulled.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createWriteStream, existsSync } from "node:fs";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "src/lib/content");
const MEDIA_DIR = join(ROOT, "static/strapi-media");

const BASE_URL =
    process.env.STRAPI_BASE_URL || "https://raise-strapi.prod.bitingbit.cloud";
const TOKEN =
    process.env.STRAPI_TOKEN ||
    "c56cdb15bed865a3044c2ab9fa9318849cd7e3fc9a669e7fa4b7eaad25054e6210ef12696f86b925623d869d51d2a7658a5c8a669bb35acd9625ca039c7e057010f8a63d76ea04544ccfb0f2071edb7c3168ce0c69bbc5e61538a72410e8a1d7694e6a9b1ac508436c484c36943d25084abf65c8c5d030ad2ec762bba5348a0f";

const LOCALES = ["de", "en"];

// Path prefix used in the rewritten JSON; matches static/ output.
const LOCAL_MEDIA_PREFIX = "/strapi-media";

// Endpoints — keys mirror strapiClient.js function names.
// `path` is the API path; `query` is the populate string sans status/locale.
// `locales: false` means we fetch only once (no locale variant).
const ENDPOINTS = [
    { key: "logo", path: "/api/logo", query: "populate=*", locales: false },
    { key: "page-headline", path: "/api/page-headline", query: "populate=*" },
    {
        key: "carousel",
        path: "/api/carousel",
        query:
            "[populate][buttonAnimation][fields][0]=url&populate[line_1][populate][image][fields][0]=url&populate[line_1][populate][image][fields][1]=name&populate[line_2][populate][image][fields][0]=url&populate[line_2][populate][image][fields][1]=name&populate[line_3][populate][image][fields][0]=url&populate[line_3][populate][image][fields][1]=name",
    },
    { key: "richtext", path: "/api/richtext", query: "populate=*" },
    { key: "registration", path: "/api/registration", query: "populate=*" },
    {
        key: "privacy-policy",
        path: "/api/privacy-policy",
        query: "populate=*",
    },
    { key: "bug-report", path: "/api/bug-report", query: "populate=*" },
    {
        key: "registration-confirmation",
        path: "/api/registration-confirmation",
        query: "populate=*",
    },
    { key: "impressum", path: "/api/impressum", query: "populate=*" },
    { key: "legal", path: "/api/legal", query: "populate=*" },
    { key: "video", path: "/api/video", query: "populate=*" },
    { key: "topbar", path: "/api/topbar", query: "populate=*" },
    { key: "teaser", path: "/api/teaser", query: "populate=*" },
    { key: "multiplayer", path: "/api/multiplayer", query: "populate=*" },
    { key: "footer", path: "/api/footer", query: "populate=*" },
    { key: "info-steps", path: "/api/info-steps", query: "populate=*" },
    {
        key: "info-steps-section",
        path: "/api/info-steps-section",
        query: "populate=*",
    },
    {
        key: "beta-agreement",
        path: "/api/beta-agreement",
        query: "populate=*",
    },
    {
        key: "head-insertion",
        path: "/api/head-insertion",
        query: "populate=*",
        locales: false,
    },
];

async function fetchJson(path, query, locale) {
    let url = `${BASE_URL}${path}?${query}&status=prod`;
    if (locale) url += `&locale=${locale}`;
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText} on ${url}\n${body}`);
    }
    return await res.json();
}

// Files matching these extensions stay on Strapi-CDN (too large for GH Pages
// 100MB-per-file limit). Their URLs are rewritten to absolute Strapi URLs so
// the site keeps working without local copies.
const SKIP_DOWNLOAD_EXT = /\.(mp4|mov|webm)$/i;

const downloaded = new Set();
const linkedRemote = new Set();

async function downloadMedia(strapiPath) {
    if (!strapiPath || typeof strapiPath !== "string") return strapiPath;
    if (!strapiPath.startsWith("/uploads/")) return strapiPath;
    if (SKIP_DOWNLOAD_EXT.test(strapiPath)) {
        const absolute = `${BASE_URL}${strapiPath}`;
        linkedRemote.add(absolute);
        return absolute;
    }
    const localPath = `${LOCAL_MEDIA_PREFIX}${strapiPath}`;
    const dest = join(MEDIA_DIR, strapiPath.replace(/^\//, ""));
    if (downloaded.has(dest)) return localPath;
    downloaded.add(dest);
    if (existsSync(dest)) return localPath;
    await mkdir(dirname(dest), { recursive: true });
    const remote = `${BASE_URL}${strapiPath}`;
    const res = await fetch(remote);
    if (!res.ok) {
        console.warn(`  ! media ${remote} -> ${res.status}`);
        return localPath;
    }
    await finished(
        Readable.fromWeb(res.body).pipe(createWriteStream(dest)),
    );
    return localPath;
}

// Walk a JSON tree, find all { url: "/uploads/..." } media nodes, download
// the file, replace the URL with the local path. Mutates in place.
async function rewriteMediaUrls(node) {
    if (Array.isArray(node)) {
        for (const item of node) await rewriteMediaUrls(item);
        return;
    }
    if (node && typeof node === "object") {
        for (const key of Object.keys(node)) {
            const val = node[key];
            if (
                key === "url" &&
                typeof val === "string" &&
                val.startsWith("/uploads/")
            ) {
                node[key] = await downloadMedia(val);
            } else if (val && typeof val === "object") {
                await rewriteMediaUrls(val);
            }
        }
    }
}

async function main() {
    await mkdir(CONTENT_DIR, { recursive: true });
    await mkdir(MEDIA_DIR, { recursive: true });

    let count = 0;
    for (const ep of ENDPOINTS) {
        const locales = ep.locales === false ? [null] : LOCALES;
        for (const locale of locales) {
            const tag = locale ? `${ep.key}.${locale}` : ep.key;
            process.stdout.write(`  fetching ${tag} ...`);
            try {
                const json = await fetchJson(ep.path, ep.query, locale);
                await rewriteMediaUrls(json);
                const out = join(CONTENT_DIR, `${tag}.json`);
                await writeFile(out, JSON.stringify(json, null, 2));
                console.log(" ok");
                count++;
            } catch (err) {
                console.log(` FAIL: ${err.message}`);
                throw err;
            }
        }
    }
    console.log(`\n${count} files written to ${CONTENT_DIR}`);
    console.log(`${downloaded.size} media files in ${MEDIA_DIR}`);
    if (linkedRemote.size > 0) {
        console.log(
            `${linkedRemote.size} large media files left on Strapi-CDN:`,
        );
        for (const u of linkedRemote) console.log(`  ${u}`);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
