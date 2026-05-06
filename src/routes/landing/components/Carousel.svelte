<script lang="ts">
    import Marquee from "$lib/components/Marquee.svelte";
    import { fetchCarousel, fetchRichtext, getStrapiBaseUrl } from "$lib/strapiClient.js";
    import { onMount } from "svelte";
    import { inview } from "svelte-inview";
    import Swiper from "swiper";
    // Swiper CSS imports
    import "swiper/css";
    import "swiper/css/pagination";
    import { Pagination } from "swiper/modules";
    import RiveAnimation from "./RiveAnimation.svelte";

    let inView = $state(false);
    let swiperEl: any;
    let swiper: Swiper | null = null;
    let carouselData: any = $state(null);
    let richtextData: any = $state(null);

    // ===== BUTTON TEXT HOVER ANIMATION =====
    let isHovering = $state(false);
    let buttonTextOpacity = $state(0);
    let buttonTextTranslateY = $state(30);

    // ===== CAROUSEL CONTENT ANIMATION =====
    let carouselContentOpacity = $state(1);
    let carouselContentTranslateY = $state(0);

    // ===== SUBTEXT ANIMATION =====
    let subtextOpacity = $state(0);
    let subtextTranslateY = $state(100);
    let subtextInView = $state(false);
    let subtextElement: HTMLElement;

    // ===== HEADLINES ANIMATION =====
    let topHeadlineOpacity = $state(0);
    let topHeadlineTranslateY = $state(0);
    let topHeadlineTranslateX = $state(-80); // Größere horizontale Verschiebung
    let bottomHeadlineOpacity = $state(0);
    let bottomHeadlineTranslateY = $state(0);
    let bottomHeadlineTranslateX = $state(80); // Größere horizontale Verschiebung
    let headlinesInView = $state(false);
    let buttonAnimationSrc: string = $state("");

    let line1Images: any[] = $state([]);
    let line2Images: any[] = $state([]);
    let line3Images: any[] = $state([]);

    // Carousel-Daten von Strapi laden
    fetchCarousel()
        .then((data) => {
            carouselData = data;
            line1Images = carouselData.data.line_1.image.sort((a: any, b: any) => a.name.localeCompare(b.name));
            line2Images = carouselData.data.line_2.image.sort((a: any, b: any) => a.name.localeCompare(b.name));
            line3Images = carouselData.data.line_3.image.sort((a: any, b: any) => a.name.localeCompare(b.name));
            // TODO: should be done like Multiplayer Animation
            buttonAnimationSrc = getStrapiBaseUrl() + carouselData?.data.buttonAnimation.url;
        })
        .catch(() => {});

    // Richtext-Daten von Strapi laden
    fetchRichtext()
        .then((data) => (richtextData = data))
        .catch(() => {});

    function getMobileImageUrls() {
        if (!carouselData?.data) {
            return [];
        }
        const allImageUrls = new Set(
            [...line1Images, ...line2Images, ...line3Images]
                .sort((a: any, b: any) => a.name.localeCompare(b.name))
                .map((img: any) => `${getStrapiBaseUrl()}${img.url}`),
        );

        return allImageUrls;
    }

    // ===== HOVER FUNCTIONS FÜR BUTTON TEXT =====
    function handleButtonTextHover(show: boolean) {
        isHovering = show;
        buttonTextOpacity = show ? 1 : 0;
        buttonTextTranslateY = show ? 0 : 30;
    }

    // ===== HEADLINES ANIMATION HANDLERS =====
    function handleHeadlinesInView(event: any) {
        headlinesInView = event.detail.inView;
        if (headlinesInView) {
            // Reveal Animation für beide Headlines - nur horizontal
            topHeadlineOpacity = 1;
            topHeadlineTranslateY = 0;
            topHeadlineTranslateX = 0;

            bottomHeadlineOpacity = 1;
            bottomHeadlineTranslateY = 0;
            bottomHeadlineTranslateX = 0;
        } else {
            // Hide Animation für beide Headlines - nur horizontal
            setTimeout(() => {
                topHeadlineOpacity = 0;
                topHeadlineTranslateY = 0;
                topHeadlineTranslateX = -80; // Nach links ausfahren

                bottomHeadlineOpacity = 0;
                bottomHeadlineTranslateY = 0;
                bottomHeadlineTranslateX = 80; // Nach rechts ausfahren
            }, 200);
        }
    }

    // ===== SUBTEXT ANIMATION HANDLERS =====
    function handleSubtextInView(event: any) {
        subtextInView = event.detail.inView;
        if (subtextInView) {
            // Reveal Animation für Subtext
            subtextOpacity = 1;
            subtextTranslateY = 0;
        } else {
            // Hide Animation für Subtext - sofort ausblenden
            subtextOpacity = 0;
            subtextTranslateY = 100; // Nach unten ausfahren
        }
    }

    // ===== SCROLL-BASIERTE SUBTEXT ANIMATION =====
    function handleSubtextScroll() {
        if (!subtextElement) return;

        const rect = subtextElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const triggerPoint = viewportHeight * 0.3; // 30vh

        // Berechne Progress: 0 = bei 30vh, 1 = bei top: 0
        const progress = Math.max(0, Math.min(1, (triggerPoint - rect.top) / triggerPoint));

        if (rect.top <= triggerPoint && rect.bottom >= 0) {
            // Text ist sichtbar und sollte ausgeblendet werden
            subtextOpacity = 1 - progress * 0.8; // Fade out basierend auf Progress
            subtextTranslateY = progress * 50; // Nach unten ausfahren
        } else if (rect.top > triggerPoint) {
            // Text ist noch nicht bei 30vh - normal anzeigen
            subtextOpacity = 1;
            subtextTranslateY = 0;
        }
    }

    onMount(() => {
        if (swiperEl) {
            swiper = new Swiper(swiperEl, {
                modules: [Pagination],
                spaceBetween: 8,
                slidesPerView: "auto",
                centeredSlides: true,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
            });
        }

        // Scroll-Listener für Subtext-Animation
        window.addEventListener("scroll", handleSubtextScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleSubtextScroll);
        };
    });

    let mobileButton: RiveAnimation;

    $effect(() => {
        if (inView) {
            mobileButton.swing();
        } else {
            mobileButton.pull();
        }
    });
</script>

<!-- ===== RIVE ANIMATION SECTION ===== -->
<div
    use:inview={{ unobserveOnEnter: false, threshold: 0, rootMargin: "20% 0% -20% 0%" }}
    on:inview_change={(event: any) => (inView = event.detail.inView)}
    class="relative xl:pt-30 2xl:pb-115 overflow-hidden
           transform transition duration-600 ease-in-out
           {inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10%]'}">
    <div
        class="fixed top-0 min-w-[400vw] 2xl:min-w-[250%] h-[100%]"
        style="border-radius: 50%; z-index: -1; left: 50%; transform: translateX(-50%); background-image: linear-gradient(to bottom, #e7ebf6, #cdbbba);">
    </div>

    <div class="text-black relative w-full max-w-[1060px] mx-auto">
        <div class="flex justify-center">
            <div class="hidden xl:block relative">
                <RiveAnimation src={buttonAnimationSrc} onButtonTextHover={handleButtonTextHover} />
            </div>
            <div class="xl:hidden relative mt-25">
                <RiveAnimation
                    src={buttonAnimationSrc}
                    bind:this={mobileButton}
                    onButtonTextHover={handleButtonTextHover} />
            </div>
        </div>
        <!-- ===== ButtonText - Mobile/Tablet (immer sichtbar) ===== -->
        <h3
            class="xl:hidden w-84 text-center text-md text-black mt-15 mb-10 mx-auto
            transform transition duration-1000 ease-in-out
            {inView ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-[40%]'}">
            {richtextData?.data?.animatedText}
        </h3>

        <!-- ===== ButtonText - Desktop (Hover-basiert) ===== -->
        <h3
            class="hidden xl:block absolute right-24 top-45 w-80 transform -translate-y-1/2 text-md text-left text-black max-w-md transition-all duration-500 ease-out"
            style="opacity: {buttonTextOpacity}; transform: translateY({buttonTextTranslateY}px) translateY(-50%);">
            {richtextData?.data?.animatedText}
        </h3>
    </div>
    <div
        use:inview={{ unobserveOnEnter: true, threshold: 0 }}
        on:inview_change={(event: any) => (inView = event.detail.inView)}
        class="relative xl:pt-15 overflow-hidden">
        <div class="text-black">
            <!-- Mobile Dragable Carousel - nur für mobile Breakpoints sichtbar -->
            <div
                class="mt-12 flex flex-col items-center md:hidden transform transition-all duration-700 ease-out"
                style="opacity: {carouselContentOpacity}; transform: translateY({carouselContentTranslateY}px);"
                use:inview={{ unobserveOnEnter: false, threshold: 0.5 }}>
                <!-- Mobile Headlines -->
                <div class="w-full max-w-[1060px] mx-auto mb-4">
                    <!-- Obere Headline - Mobile -->
                    {#if richtextData?.data?.headline_top}
                        <div class="flex justify-center mb-2">
                            <h3 class="font-extrabold text-2xl sm:text-3xl uppercase text-[#2A5364] text-center px-4">
                                {richtextData.data.headline_top}
                            </h3>
                        </div>
                    {/if}
                </div>

                <div class="w-full">
                    <div class="swiper" bind:this={swiperEl}>
                        <div class="swiper-wrapper">
                            {#each getMobileImageUrls() as image, index}
                                <div class="swiper-slide" style="width: 320px;">
                                    <div class="flex items-center justify-center" style="height: 325px;">
                                        <img
                                            src={image}
                                            class="rounded-box w-full h-full object-contain"
                                            alt="Carousel image {index + 1}" />
                                    </div>
                                </div>
                            {/each}
                        </div>
                        <!-- Pagination innerhalb des Swiper-Containers -->
                        <div
                            class="swiper-pagination"
                            style="--swiper-pagination-color: #142831; position: relative; margin-top: 36px;">
                        </div>
                    </div>
                </div>

                <!-- Untere Headline - Mobile -->
                {#if richtextData?.data?.headline_bottom}
                    <div class="w-full max-w-[1060px] mx-auto mt-4">
                        <div class="flex justify-center">
                            <h3 class="font-extrabold text-2xl sm:text-3xl uppercase text-[#2A5364] text-center px-4">
                                {richtextData.data.headline_bottom}
                            </h3>
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Desktop Marquee - nur für Desktop sichtbar -->
            <div
                class="mt-12 hidden md:block relative transform transition-all duration-700 ease-out"
                style="opacity: {carouselContentOpacity}; transform: translateY({carouselContentTranslateY}px);"
                use:inview={{ unobserveOnEnter: false, threshold: 0.5 }}>
                <!-- Obere Headline - Unabhängiger Wrapper -->
                {#if richtextData?.data?.headline_top}
                    <div
                        class="absolute -top-12 xl:-top-8 -left-30 right-0 z-20 transform transition-all duration-700 ease-out"
                        style="opacity: {topHeadlineOpacity}; transform: translateY({topHeadlineTranslateY}px) translateX({topHeadlineTranslateX}px);"
                        use:inview={{ unobserveOnEnter: false, threshold: 0.3 }}
                        on:inview_change={handleHeadlinesInView}>
                        <div class="w-full max-w-[1060px] mx-auto">
                            <div class="flex justify-center xl:justify-start">
                                <h3
                                    class="font-extrabold text-4xl lg:text-4xl xl:text-5xl uppercase text-[#2A5364] text-center xl:text-left px-4">
                                    {richtextData.data.headline_top}
                                </h3>
                            </div>
                        </div>
                    </div>
                {/if}

                <!-- Marquee Container -->
                <div class="overflow-hidden h-[575px] aspect-video mx-auto rounded-3xl relative fade-mask">
                    <!-- Innerer Wrapper mit Rotation um 15° gegen Uhrzeigersinn -->
                    {#if line1Images.length && line2Images.length && line3Images.length}
                        <div
                            class="relative flex w-[200vw] flex-col items-center justify-center py-32 -rotate-[15deg] -translate-x-1/2 left-1/2 -mt-64">
                            <!-- Erste Reihe: Animation nach rechts -->
                            <Marquee pauseOnHover class="[--duration:20s]">
                                {#each line1Images as image, index}
                                    <img
                                        style="width: 220px;"
                                        src={getStrapiBaseUrl() + image.url}
                                        class="rounded-box w-full h-full object-contain"
                                        alt="Carousel image {index + 1}" />
                                {/each}
                            </Marquee>
                            <!-- Zweite Reihe: Animation nach links (reverse) -->
                            <Marquee reverse pauseOnHover class="[--duration:20s]">
                                {#each line2Images as image, index}
                                    <img
                                        style="width: 220px;"
                                        src={getStrapiBaseUrl() + image.url}
                                        class="rounded-box w-full h-full object-contain"
                                        alt="Carousel image {index + 1}" />
                                {/each}
                            </Marquee>
                            <!-- Dritte Reihe: Animation nach rechts (wie erste Reihe) -->
                            <Marquee pauseOnHover class="[--duration:20s]">
                                {#each line3Images as image, index}
                                    <img
                                        style="width: 220px;"
                                        src={getStrapiBaseUrl() + image.url}
                                        class="rounded-box w-full h-full object-contain"
                                        alt="Carousel image {index + 1}" />
                                {/each}
                            </Marquee>
                        </div>
                    {/if}
                </div>

                <!-- Untere Headline - Unabhängiger Wrapper -->
                {#if richtextData?.data?.headline_bottom}
                    <div
                        class="absolute -bottom-12 xl:-bottom-8 left-0 -right-30 z-20 transform transition-all duration-700 ease-out"
                        style="opacity: {bottomHeadlineOpacity}; transform: translateY({bottomHeadlineTranslateY}px) translateX({bottomHeadlineTranslateX}px);"
                        use:inview={{ unobserveOnEnter: false, threshold: 0.3 }}
                        on:inview_change={handleHeadlinesInView}>
                        <div class="w-full max-w-[1060px] mx-auto">
                            <div class="flex justify-center xl:justify-end">
                                <h3
                                    class="font-extrabold text-3xl lg:text-4xl xl:text-5xl uppercase text-[#2A5364] text-center xl:text-right px-4">
                                    {richtextData.data.headline_bottom}
                                </h3>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>

            <div
                bind:this={subtextElement}
                class="text-center mt-24 pb-24 px-17 text-xl transform transition-all duration-700 ease-out"
                style="opacity: {subtextOpacity}; transform: translateY({-subtextTranslateY}px);"
                use:inview={{ unobserveOnEnter: false, threshold: 0.8 }}
                on:inview_change={handleSubtextInView}>
                {#if richtextData?.data?.subtext}
                    {@html richtextData.data.subtext}
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .fade-mask {
        -webkit-mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.2) 2%,
            rgba(0, 0, 0, 0.6) 5%,
            rgba(0, 0, 0, 0.9) 10%,
            rgba(0, 0, 0, 1) 14%,
            rgba(0, 0, 0, 1) 50%,
            rgba(0, 0, 0, 1) 86%,
            rgba(0, 0, 0, 0.9) 90%,
            rgba(0, 0, 0, 0.6) 95%,
            rgba(0, 0, 0, 0.2) 98%,
            rgba(0, 0, 0, 0) 100%
        );
        mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.2) 2%,
            rgba(0, 0, 0, 0.6) 5%,
            rgba(0, 0, 0, 0.9) 10%,
            rgba(0, 0, 0, 1) 14%,
            rgba(0, 0, 0, 1) 86%,
            rgba(0, 0, 0, 0.9) 90%,
            rgba(0, 0, 0, 0.6) 95%,
            rgba(0, 0, 0, 0.2) 98%,
            rgba(0, 0, 0, 0) 100%
        );
    }
</style>
