// Static replacement for the original Strapi-axios client.
//
// Reads pre-snapshotted JSON from src/lib/content/ (committed in the repo,
// produced by `pnpm refresh-content` -> scripts/snapshot-strapi.mjs). All
// function signatures and return shapes mirror the original network client,
// so call sites in components stay unchanged.
//
// Media URLs in the snapshotted JSON have already been rewritten to
// `/strapi-media/...` (served from `static/`), so `getStrapiBaseUrl()` now
// returns an empty string — `getStrapiBaseUrl() + entry.url` still resolves
// correctly to a local path.

import { base } from "$app/paths";
import LocalStorageUtil from "./localStorageUtil";

const modules = import.meta.glob("./content/*.json", {
    eager: true,
    import: "default",
});

const content = {};
for (const [path, mod] of Object.entries(modules)) {
    const name = path.replace(/^\.\/content\//, "").replace(/\.json$/, "");
    content[name] = mod;
}

function get(key, withLocale = true) {
    if (!withLocale) {
        const data = content[key];
        if (!data) console.warn(`[strapiClient] missing content: ${key}`);
        return Promise.resolve(structuredClone(data ?? { data: null, meta: {} }));
    }
    const locale = LocalStorageUtil.getLocale();
    const localizedKey = `${key}.${locale}`;
    const data = content[localizedKey] ?? content[`${key}.de`];
    if (!data)
        console.warn(`[strapiClient] missing content: ${localizedKey}`);
    return Promise.resolve(structuredClone(data ?? { data: null, meta: {} }));
}

export function getStrapiBaseUrl() {
    return base;
}

export const fetchLogo = () => get("logo", false);
export const fetchPageHeadline = () => get("page-headline");
export const fetchCarousel = () => get("carousel");
export const fetchRichtext = () => get("richtext");
export const fetchRegistrationComponent = () => get("registration");
export const fetchPrivacyPolicy = () => get("privacy-policy");
export const fetchBugReport = () => get("bug-report");
export const fetchRegistrationConfirmation = () =>
    get("registration-confirmation");
export const fetchImprint = () => get("impressum");
export const fetchLegal = () => get("legal");
export const fetchVideo = () => get("video");
export const fetchBetaAgreement = () => get("beta-agreement");
export const fetchHeadInsertion = () => get("head-insertion", false);

export async function fetchTopBarData() {
    const res = await get("topbar");
    const data = res.data;
    const navigationLinks = [
        { id: "start", label: data.mobileNavStart },
        { id: "schritt-fuer-schritt", label: data.mobileNavSteps },
        { id: "beispiele", label: data.mobileNavExample },
        { id: "multiplayer", label: data.mobileNavMultiplayer },
        { id: "tester-registration", label: data.mobileNavTesterRegistration },
        { id: "raisegpt", label: "raiseGPT" },
        { id: "bugreport", label: data.mobileNavBugReport },
    ];
    return {
        testerRegistrationButtonText: data.testerRegistrationButtonText,
        mobileMenueButtonCloseText: data.mobileMenueButtonCloseText,
        bugReportButtonText: data.bugReportButtonText,
        navigationLinks,
    };
}

export async function fetchTeaserData() {
    const res = await get("teaser");
    return {
        headLineQuote: res.data.headLineQuote,
        headlineCited: res.data.headlineCited,
        subText: res.data.subText,
        teaserImageSrc: getStrapiBaseUrl() + (res.data.teaserImage?.url ?? ""),
    };
}

export async function fetchMultiPlayerData() {
    const res = await get("multiplayer");
    return {
        bigCirlceText: res.data.bigCirlceText,
        cirlcleLeftDown: res.data.cirlcleLeftDown,
        cirlcleRightUp: res.data.cirlcleRightUp,
        mobileHeadline: res.data.mobileHeadline,
        mobileSubText: res.data.mobileSubText,
        mobileUnderCirlcle: res.data.mobileUnderCirlcle,
        multiplayerAnimationUrl: !res.data.multiplayerAnimation?.url
            ? null
            : getStrapiBaseUrl() + res.data.multiplayerAnimation?.url,
    };
}

export async function fetchFooterData() {
    const res = await get("footer");
    return {
        slogan: res.data.slogan,
        legalLinkText: res.data.legalLinkText,
        imprintLinkText: res.data.imprintLinkText,
        privacyLinkText: res.data.privacyLinkText,
        betaLinkText: res.data.betaLinkText,
        logo: getStrapiBaseUrl() + (res.data.logo?.url ?? ""),
    };
}

export async function fetchInfoSteps() {
    const res = await get("info-steps");
    const infoSteps = res.data.map((d) => ({
        title: d.title,
        icon: getStrapiBaseUrl() + (d.icon?.url ?? ""),
        text: d.text,
        sortOrder: d.sortOrder,
    }));
    return { infoSteps };
}

export async function fetchInfoStepSectionData() {
    const res = await get("info-steps-section");
    return {
        headlineMobile: res.data.headlineMobile,
        desktopHeadline: res.data.desktopHeadline,
        desktopSubHeading: res.data.desktopSubHeading,
        arrowDownImage:
            getStrapiBaseUrl() + (res.data.arrowDownImage?.url ?? ""),
        arrowUpImage:
            getStrapiBaseUrl() + (res.data.arrowUpImage?.url ?? ""),
        phoneImage: getStrapiBaseUrl() + (res.data.phoneImage?.url ?? ""),
        phoneScreenAnimation: !res.data.phoneScreenAnimation?.url
            ? null
            : getStrapiBaseUrl() + res.data.phoneScreenAnimation?.url,
    };
}
