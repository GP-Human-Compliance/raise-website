<script lang="ts">
    import { fetchInfoSteps, fetchInfoStepSectionData } from "$lib/strapiClient";
    import type { InfoStep } from "$lib/types";
    import { onMount } from "svelte";
    import { inview } from "svelte-inview";
    import InfoSectionPhone from "./InfoSectionPhone.svelte";

    let headlineMobile: string = "";

    let elements: InfoStep[] = [];
    let arrowDownImage: string = "";
    let arrowUpImage: string = "";
    let phoneImage: string = "";
    let phoneScreenAnimation: string = "";

    let desktopHeadline: string = "";
    let desktopSubHeading: string = "";

    onMount(async () => {
        const infoStepsRes = await fetchInfoSteps();
        const infoStepsSectionRes = await fetchInfoStepSectionData();
        headlineMobile = infoStepsSectionRes.headlineMobile;
        desktopHeadline = infoStepsSectionRes.desktopHeadline;
        desktopSubHeading = infoStepsSectionRes.desktopSubHeading;
        elements = infoStepsRes.infoSteps.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
        arrowDownImage = infoStepsSectionRes.arrowDownImage;
        arrowUpImage = infoStepsSectionRes.arrowUpImage;
        phoneImage = infoStepsSectionRes.phoneImage;
        phoneScreenAnimation = infoStepsSectionRes.phoneScreenAnimation || "/images/rive/Phone_Screen_animation.riv";
    });

    let phoneInView = false;
    let cardSectionInView = false;
    let cardsInView = false;
</script>

<div
    class="absolute xl:-top-30 -bottom-200 left-0 right-0 bg-white/7 transition-transform duration-75 ease-out"
    style="clip-path: polygon(0 0, 100% 120px, 100% 100%, 0 100%, 0 180px);">
</div>
<div
    class="hidden xl:flex justify-center"
    use:inview={{ unobserveOnEnter: false, threshold: 0, rootMargin: "0% 0% -30% 0%" }}
    on:inview_change={(event: any) => (phoneInView = event.detail.inView)}>
    <InfoSectionPhone
        {desktopHeadline}
        {desktopSubHeading}
        src={phoneScreenAnimation}
        phoneImageUrl={phoneImage}
        arrowDownImageUrl={arrowDownImage}
        arrowUpImageUrl={arrowUpImage}
        {elements}
        inView={phoneInView}></InfoSectionPhone>
</div>
<div class="xl:hidden w-full relative overflow-hidden mt-15">
    <h3
        use:inview={{ unobserveOnEnter: false, threshold: 0.2 }}
        on:inview_change={(event: any) => (cardSectionInView = event.detail.inView)}
        class="text-xl font-bold text-center
        transform transition duration-600 ease-in-out
        {cardSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30%]'}">
        {@html headlineMobile}
    </h3>

    <div
        use:inview={{ unobserveOnEnter: false, threshold: 0.1 }}
        on:inview_change={(event: any) => (cardsInView = event.detail.inView)}
        class="mt-16
            transform transition duration-600 ease-in-out
            {cardsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20%]'}">
        {#each elements as element, i}
            <div
                class="flex pl-6 transform transition duration-1200 ease-in-out mt-3
                {cardsInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[90%]'}"
                style={cardsInView ? `transition-delay: ${(i + 1) * 100}ms` : ""}>
                <div class="w-1/12 text-xl font-bold mt-6">{i + 1}.</div>

                <div class="w-11/12 rounded-l-xl bg-white text-black h-27">
                    <div class="p-3 h-full">
                        <div class="flex items-center">
                            <img src={element.icon} alt={element.title} class="w-6 h-6" />
                            <h2 class="ml-4 font-bold text-xl text-secondary">{element.title}</h2>
                        </div>
                        <p class="text-left text-sm mt-2">{element.text}</p>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>
