<script lang="ts">
    import { base } from "$app/paths";
    import LocalStorageUtil from "$lib/localStorageUtil";
    import { fetchRegistrationComponent } from "$lib/strapiClient.js";
    import { MediaQuery } from "svelte/reactivity";

    // TODO: real public store URLs (App Store + Google Play). Placeholders for now.
    const APPLE_STORE_URL = "#";
    const GOOGLE_PLAY_URL = "#";

    let strapiData: any = $state(null);
    const locale = $derived(LocalStorageUtil.getLocale());

    fetchRegistrationComponent()
        .then((res) => (strapiData = res))
        .catch(() => {});

    const mediaQuery = new MediaQuery("min-width: 786px");

    function splitOnFirstSpace(text: string | undefined): [string, string] {
        if (text === undefined) return ["", ""];
        const index = text.indexOf(" ");
        if (index === -1) return [text, ""];
        return [text.substring(0, index), text.substring(index + 1)];
    }
</script>

<div class="w-full grid place-items-center px-4">
    <div
        class={"w-full max-w-[1066px] py-12 md:py-16 md:border-2 md:border-gray-300 border-none md:rounded-[30px] md:text-black bg-inherit md:bg-gradient-to-tl md:from-[#EAD8D6] md:to-[#E7EBF7] sm:bg-inherit text-white"}>
        {#if mediaQuery.current}
            <h1 class={"text-[40px] font-bold text-center whitespace-pre-line"}>
                {strapiData?.data?.headline}
            </h1>
        {:else}
            <h1 class={"text-2xl font-bold text-center px-4 whitespace-pre-line"}>
                {splitOnFirstSpace(strapiData?.data?.headline)[0]} <br />
                {splitOnFirstSpace(strapiData?.data?.headline)[1]}
            </h1>
        {/if}

        <div class="mt-4 md:mt-6">
            {#each strapiData?.data?.subheadline ?? [] as paragraph}
                <p class={"font-bold leading-6 text-[20px] text-center px-4"}>{paragraph.children[0].text}</p>
            {/each}
        </div>

        <div class="w-full flex justify-center pt-8 md:pt-10">
            <div class="flex items-center gap-3 md:gap-5">
                <a
                    href={APPLE_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download on the App Store"
                    class="block transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-md">
                    <img
                        src="{base}/images/badges/app-store-{locale}.svg?v=2"
                        alt="Download on the App Store"
                        class="h-[44px] md:h-[52px] w-auto" />
                </a>
                <a
                    href={GOOGLE_PLAY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Get it on Google Play"
                    class="block transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-md">
                    <img
                        src="{base}/images/badges/google-play-{locale}.png?v=2"
                        alt="Get it on Google Play"
                        class="h-[44px] md:h-[52px] w-auto" />
                </a>
            </div>
        </div>
    </div>
</div>
