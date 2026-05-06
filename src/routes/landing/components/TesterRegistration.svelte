<script lang="ts">
    import { fetchRegistrationComponent, getStrapiBaseUrl } from "$lib/strapiClient.js";
    import { MediaQuery } from "svelte/reactivity";

    // TODO: real public store URLs (App Store + Google Play). Placeholders for now.
    const APPLE_STORE_URL = "#";
    const GOOGLE_PLAY_URL = "#";

    let strapiData: any = $state(null);

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

<div class="w-full grid place-items-center transform transition-all duration-700 ease-out relative">
    <div class="relative z-10 transform transition-all duration-700 ease-out">
        <div
            class={"h-[644px] lg:w-[1066px] md:w-full md:h-[677px]  md:pt-[119px]   pt-[63px] md:border-2 md:border-gray-300 border-none md:rounded-[30px] md:text-black bg-inherit  md:bg-gradient-to-tl md:from-[#EAD8D6] md:to-[#E7EBF7] sm:bg-inherit text-white"}>
            {#if mediaQuery.current}
                <h1 class={"text-[40px] font-bold text-center text-2xl whitespace-pre-line"}>
                    {strapiData?.data?.headline}
                </h1>
            {:else}
                <h1 class={"text-[40px] font-bold text-center text-2xl px-4 whitespace-pre-line"}>
                    {splitOnFirstSpace(strapiData?.data?.headline)[0]} <br />
                    {splitOnFirstSpace(strapiData?.data?.headline)[1]}
                </h1>
            {/if}

            <div class="md:mt-5 mt-[63px]">
                {#each strapiData?.data?.subheadline ?? [] as paragraph}
                    <p class={"font-bold leading-6 text-[20px] text-center px-4"}>{paragraph.children[0].text}</p>
                {/each}
            </div>

            <div class="w-full flex justify-center pt-12 md:pt-16">
                <div class="flex items-center gap-4 md:gap-6">
                    <a
                        href={APPLE_STORE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Download on the App Store"
                        class="block transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-2xl">
                        <img
                            class="w-[120px] h-[120px] md:w-[140px] md:h-[140px]"
                            src={strapiData?.data?.logo_apple?.url
                                ? getStrapiBaseUrl() + strapiData.data.logo_apple.url
                                : ""}
                            alt="App Store" />
                    </a>
                    <a
                        href={GOOGLE_PLAY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Get it on Google Play"
                        class="block transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-2xl">
                        <img
                            class="w-[100px] h-[120px] md:w-[120px] md:h-[140px]"
                            src={strapiData?.data?.logo_android?.url
                                ? getStrapiBaseUrl() + strapiData.data.logo_android.url
                                : ""}
                            alt="Google Play" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
