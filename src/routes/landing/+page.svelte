<script lang="ts">
    import { onMount } from "svelte";
    import BugReport from "./components/BugReport.svelte";
    import Carousel from "./components/Carousel.svelte";
    import Footer from "./components/Footer.svelte";
    import Hero from "./components/Hero.svelte";
    import InfoSteps from "./components/InfoSteps.svelte";
    import Multiplayer from "./components/Multiplayer.svelte";
    import Teaser from "./components/Teaser.svelte";
    import TesterRegistration from "./components/TesterRegistration.svelte";
    import Topbar from "./components/Topbar.svelte";
    import VideoSection from "./components/VideoSection.svelte";

    let scrollY = $state(0);
    let raf: number | null = null;
    let infoSectionVisible = $state(true);
    let isPageLoaded = $state(false);
    let infoStepsVisible = $state(true);

    // ===== GLOBAL SCROLL OFFSET =====
    const NAVIGATION_OFFSET = 160; // Navigation height + 5vh equivalent

    function onScroll() {
        if (raf !== null) return;
        raf = requestAnimationFrame(() => {
            scrollY = window.scrollY;

            // ===== INFO SECTION VISIBILITY =====
            // Berechnet wann Carousel top: 20vh erreicht
            let carouselElement = document.getElementById("beispiele");
            if (carouselElement) {
                let carouselRect = carouselElement.getBoundingClientRect();
                let viewportHeight = window.innerHeight;
                let carouselTopVh = (carouselRect.top / viewportHeight) * 100;

                // InfoSection ausblenden wenn Carousel top: 20vh erreicht
                infoSectionVisible = carouselTopVh > 20;
            }

            // ===== INFO STEPS VISIBILITY =====
            // InfoSteps ausblenden wenn Carousel den oberen Rand erreicht
            let infoStepsElement = document.getElementById("schritt-fuer-schritt");
            if (carouselElement && infoStepsElement) {
                let carouselRect = carouselElement.getBoundingClientRect();
                let infoStepsRect = infoStepsElement.getBoundingClientRect();

                // InfoSteps ausblenden wenn Carousel den oberen Rand der InfoSteps erreicht
                infoStepsVisible = carouselRect.top > infoStepsRect.top;
            }

            raf = null;
        });
    }

    // ===== SMOOTH SCROLL WITH OFFSET =====
    function smoothScrollTo(targetId: string) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const targetPosition = targetElement.offsetTop - NAVIGATION_OFFSET;
            window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
            });
        }
    }

    // ===== GLOBAL CLICK HANDLER FOR ANCHOR LINKS =====
    function handleAnchorClick(event: Event) {
        const target = event.target as HTMLElement;
        const link = target.closest('a[href^="#"]');

        if (link) {
            event.preventDefault();
            const targetId = link.getAttribute("href")?.substring(1);
            if (targetId) {
                smoothScrollTo(targetId);
            }
        }
    }

    onMount(() => {
        // Stelle sicher, dass die Seite beim Reload ganz oben startet
        window.scrollTo(0, 0);

        // Initialisiere scrollY auf 0 beim Mount
        scrollY = 0;

        // Warte kurz bevor die InfoSteps aktiviert wird
        setTimeout(() => {
            isPageLoaded = true;
        }, 100);

        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("click", handleAnchorClick);

        return () => {
            window.removeEventListener("scroll", onScroll);
            document.removeEventListener("click", handleAnchorClick);
            if (raf) cancelAnimationFrame(raf);
        };
    });
</script>

<div class="relative">
    <!-- Globaler Parallax-Hintergrund -->
    <div
        class="pointer-events-none absolute left-0 top-0 h-full z-0 overflow-hidden w-full"
        style="
            background-size: 100% 100%;
            background-position: 0px 0px,0px 0px,0px 0px,0px 0px;
            background-image:
                radial-gradient(230% 54% at 0% 37%, #ff6f4c8c 0%, #073AFF00 50%),
                radial-gradient(274% 84% at 135% 80%, #ff6f4c8c 0%, #073AFF00 50%),
                radial-gradient(130% 74% at -4% 103%, #142831 10%, #798DAF00 99%),
                radial-gradient(248% 91% at 111% 84%, #2A5364 0%, #142831 100%);">
    </div>
    <div class="relative z-200">
        <Topbar />
    </div>
    <div id="start" class="relative z-10 pt-28 pb-14 xl:pb-20 xl:pt-40">
        <Hero />
    </div>
    <div class="relative z-10">
        <VideoSection />
    </div>
    <div class="relative z-10 mt-30 xl:mb-20 flex justify-center">
        <Teaser />
    </div>
    <div
        id="schritt-fuer-schritt"
        class="xl:h-[800px] xl:relative z-20 transition-opacity duration-500 mb-20 xl:mb-0"
        style="opacity: {infoStepsVisible ? 1 : 0}; pointer-events: {infoStepsVisible ? 'auto' : 'none'};">
        <div class="xl:sticky xl:top-[10vh] flex justify-center">
            <InfoSteps />
        </div>
    </div>

    <div id="beispiele" class="relative z-25 xl:-mt-10">
        <Carousel />
    </div>

    <div id="multiplayer" class="relative z-30 2xl:mt-[-520px]">
        <Multiplayer />
    </div>
    <div id="tester-registration" class="relative z-30 mt-20 xl:mb-40 2xl:mt-10">
        <TesterRegistration />
    </div>
    <div id="bugreport" class="relative z-30 mt-18 xl:mt-12 scroll-mt-30">
        <BugReport />
    </div>

    <div class="relative z-30">
        <Footer />
    </div>

    <div
        class="absolute bottom-0 left-0 bg-[#ffffff12] h-350 w-full transition-transform duration-75 ease-out"
        style="clip-path: polygon(0 120px, 100% 0, 100% 100%, 0 100%, 0 180px);">
    </div>
</div>
