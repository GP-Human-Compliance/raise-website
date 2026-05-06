<script lang="ts">
    import { fetchTeaserData } from "$lib/strapiClient";
    import { onMount } from "svelte";
    import { inview } from "svelte-inview";

    // Responsive state
    let isMobile = false;

    // Parallax Scroll States
    let teaserElement: HTMLElement;
    let titleOffset = 0;
    let imageOffset = 0;
    let textOffset = 0;
    let bonaparteOffset = 0;
    let inView = false;

    let headLineQuote: string | undefined;
    let headlineCited: string;
    let subText: string;
    let imgSrc: string;

    fetchTeaserData()
        .then((data) => {
            headLineQuote = data.headLineQuote;
            headlineCited = data.headlineCited;
            subText = data.subText;
            imgSrc = data.teaserImageSrc;
        })
        .catch(() => {});

    // Check if device is mobile based on width
    function checkIsMobile() {
        isMobile = window.innerWidth <= 768;
    }

    // Parallax Scroll Handler
    function handleScroll() {
        if (!teaserElement) return;

        const rect = teaserElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const scrollProgress = (viewportCenter - elementCenter) / viewportHeight + 1;

        if (isMobile) {
            titleOffset = (scrollProgress - 1) * -80;
            imageOffset = (scrollProgress - 1) * 60;
            textOffset = 10 + (scrollProgress - 1) * -10;
            bonaparteOffset = -8 + (scrollProgress - 1) * 34;
        } else {
            titleOffset = (scrollProgress - 1) * -200;
            imageOffset = 30 + (scrollProgress - 1) * -600;
            textOffset = 30 + (scrollProgress - 1) * -400;
            bonaparteOffset = -20 + (scrollProgress - 1) * -40;
        }
    }

    onMount(() => {
        checkIsMobile();
        handleScroll()
        window.addEventListener("resize", checkIsMobile, { passive: true });
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("resize", checkIsMobile);
            window.removeEventListener("scroll", handleScroll);
        };
    });
</script>

<div
    use:inview={{ unobserveOnEnter: false, threshold: 0.1 }}
    on:inview_change={(event: any) => {
        inView = event.detail.inView;
    }}
    bind:this={teaserElement}
    class="relative text-center w-full max-w-[1060px] h-120 mx-auto
        transform transition duration-600 ease-in-out
        {inView ? 'translate-y-0' : 'translate-y-[10%]'}">
    <h3
        class="
            absolute z-1 font-bold text-center xl:text-left text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl left-0 w-full px-4
            xl:w-[813px] 2xl:right-[35%] -top-35
            transform transition-opacity duration-600 ease-in-out
            {inView ? 'opacity-100' : 'opacity-0'}"
        style="transform: translateY({titleOffset}px);">
        {#if headLineQuote}
            {@html headLineQuote}
        {/if}
        <span class="2xl:hidden font-normal text-xl">{headlineCited}</span>
    </h3>

    <div
        class="
            absolute flex justify-center 2xl:justify-end px-4 sm:px-16 xl:right-12
            transform transition-opacity duration-600 ease-in-out
            {inView ? 'opacity-100' : 'opacity-0'}"
        style="transform: translateY({imageOffset}px);">
        <img
            src={imgSrc}
            class="rounded-2xl shadow-2xl xl:max-h-none w-full sm:max-w-2/3 md:max-w-1/2 xl:max-w-[434px]" />
        <span
            class="hidden 2xl:block absolute bottom-[-20px] -right-12 text-4xl"
            style="transform: translateY({bonaparteOffset}px);">
            {headlineCited}
        </span>
    </div>

    <p
        class="
            absolute flex justify-center z-1 px-4 sm:px-12 xl:px-0 text-center xl:text-left text-lg w-full xl:w-[380px] sm:w-2/3 md:w-2/3
            2xl:justify-start xl:left-16 bottom-20 xl:bottom-50 left-1/2 -translate-x-1/2 xl:translate-x-0
            transform transition-opacity duration-300 ease-in-out
            {inView ? 'opacity-100' : 'opacity-0'}"
        style="transform: translateY({textOffset}px);">
        {subText}
    </p>
</div>
