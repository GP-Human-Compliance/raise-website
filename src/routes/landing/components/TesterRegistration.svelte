<script lang="ts">
    // ─────────────────────────────────────────────────────────────────────
    //  "Jetzt testen" — get-the-app card (WHITE variant).
    //
    //  Same twin layout & structure as the raiseGPT card, but on a white
    //  background (with the orange/blue corner glows kept as highlights).
    //  Text + logos use the dark brand variants so they read on white.
    //
    //  Layout order:
    //    • desktop: copy (wordmark → tagline → text → badges) left, logo right
    //    • mobile:  wordmark → tagline → text → LOGO → badges
    //      (badges rendered once via a snippet, placed per breakpoint)
    // ─────────────────────────────────────────────────────────────────────
    import { base } from "$app/paths";
    import LocalStorageUtil from "$lib/localStorageUtil";
    import { fetchRegistrationComponent } from "$lib/strapiClient.js";

    const APPLE_STORE_URL = "https://apps.apple.com/de/app/raise-yours-to-decide/id6740918070";
    const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=de.entscheidungsos.app";

    const locale = LocalStorageUtil.getLocale() === "en" ? "en" : "de";

    const copy = {
        de: { tagline: "yours to decide.", body1: "Der komplette RAISE-Prozess als App für iOS & Android –", body2: "dein Entscheidungs-Coach, immer griffbereit." },
        en: { tagline: "yours to decide.", body1: "The full RAISE process as an app for iOS & Android –", body2: "your decision coach, always at hand." },
    }[locale];

    let strapiData: any = $state(null);
    fetchRegistrationComponent()
        .then((res) => (strapiData = res))
        .catch(() => {});
</script>

{#snippet storeBadges(cls: string)}
    <div class="flex flex-wrap items-center gap-3 {cls}">
        <a
            href={APPLE_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download on the App Store"
            class="block overflow-hidden rounded-[10px] ring-1 ring-black/10 transition-transform hover:scale-105">
            <img src="{base}/images/badges/app-store-{locale}.svg?v=2" alt="Download on the App Store" class="h-[46px] w-auto" />
        </a>
        <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get it on Google Play"
            class="block overflow-hidden rounded-[10px] ring-1 ring-black/10 transition-transform hover:scale-105">
            <img src="{base}/images/badges/google-play-{locale}.png?v=2" alt="Get it on Google Play" class="h-[46px] w-auto" />
        </a>
    </div>
{/snippet}

<section class="w-full px-4 sm:px-6">
    <!-- ── Skyline: section header over both boxes ─────────────────── -->
    <div class="mx-auto mb-10 max-w-[1066px] text-center sm:mb-12">
        <h2 class="text-3xl font-extrabold leading-tight text-white sm:text-4xl xl:text-5xl">
            {strapiData?.data?.headline}
        </h2>
        <div class="mt-3">
            {#each strapiData?.data?.subheadline ?? [] as paragraph}
                <p class="text-base font-semibold text-white/70 sm:text-lg">{paragraph.children[0].text}</p>
            {/each}
        </div>
    </div>

    <!-- ── App card (white, twin of the raiseGPT card) ─────────────── -->
    <div class="mx-auto w-full max-w-[1066px]">
        <div class="relative overflow-hidden rounded-[28px] border border-black/5 shadow-xl">
            <div class="absolute inset-0 bg-white"></div>
            <!-- orange/blue corner highlights -->
            <div class="pointer-events-none absolute inset-0">
                <div class="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#ff6f4c]/25 blur-3xl"></div>
                <div class="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#2E7DFF]/25 blur-3xl"></div>
            </div>

            <div class="relative flex flex-col items-center gap-8 px-6 py-8 sm:px-10 sm:py-9 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
                <!-- ── Copy ─────────────────────────────────────────── -->
                <div class="max-w-[42ch] text-center lg:text-left">
                    <img
                        src="{base}/images/raise_wordmark_dark.svg"
                        alt="raise"
                        class="mx-auto h-7 w-auto sm:h-8 lg:mx-0" />

                    <p class="mt-2.5 text-xl font-semibold text-[#ff6f4c] sm:text-2xl">{copy.tagline}</p>

                    <p class="mt-3 text-sm text-[#4a5560] sm:text-base">{copy.body1}<br />{copy.body2}</p>

                    <!-- badges: desktop position (under copy) -->
                    {@render storeBadges("mt-6 hidden justify-center lg:flex lg:justify-start")}
                </div>

                <!-- ── App logo (+ mobile badges below it) ──────────── -->
                <div class="flex w-full max-w-[300px] shrink-0 flex-col items-center gap-6 lg:min-h-[250px] lg:justify-center">
                    <img
                        src="{base}/images/raise_app_logo_dark.svg"
                        alt="raise"
                        class="w-[140px] max-w-full drop-shadow-xl" />

                    <!-- badges: mobile position (under logo) -->
                    {@render storeBadges("justify-center lg:hidden")}
                </div>
            </div>
        </div>
    </div>
</section>
