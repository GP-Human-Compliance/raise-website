<script lang="ts">
    import { fetchPageHeadline } from '$lib/strapiClient.js';
    import { onMount } from 'svelte';

    let headlineData: any = $state(null);
    let isVisible = $state(false);
    let scrollY = $state(0);

    // Page headline laden
    fetchPageHeadline().then(data => headlineData = data).catch(() => {});

    onMount(() => {
        // Nach dem Laden der Seite die Animation starten
        setTimeout(() => {
            isVisible = true;
        }, 100);

        // Scroll-Event für Parallax-Effekt
        const handleScroll = () => {
            scrollY = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });
</script>

<div class="relative">
    <!-- <div
        class="absolute inset-0 -top-2 h-[1600px] bg-[url(/images/landing/hero-bg-gradient.png)] [background-size:200%_60%] bg-no-repeat opacity-20 [background-position-x:center] sm:[background-size:100%_100%] dark:opacity-15">
    </div> -->
    <div class="relative z-10 text-center" style="transform: translateY({scrollY * -1.5}px);">
        <h2 class="text-4xl xl:text-7xl md:text-6xl px-4 font-extrabold transition-all duration-1000 ease-out {isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}">
            {headlineData?.data?.headline}
        </h2>
        <p class="2xl:hidden mt-10 text-lg transition-all duration-1000 ease-out delay-300 {isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}">{headlineData?.data?.subheadline}</p>
    </div>
</div>
