<script lang="ts">
    import { fetchMultiPlayerData } from "$lib/strapiClient";
    import { onMount } from "svelte";
    import MultiplayerRiveAnimation from "./MultiplayerRiveAnimation.svelte";

    let bigCirlceText: string = $state("");
    let cirlcleLeftDown: string = $state("");
    let cirlcleRightUp: string = $state("");
    let mobileHeadline: string = $state("");
    let mobileSubText: string = $state("");
    let mobileUnderCirlcle: string = $state("");
    let riveSrc: string = $state("");

    fetchMultiPlayerData().then((data) => {
        bigCirlceText = data.bigCirlceText;
        cirlcleLeftDown = data.cirlcleLeftDown;
        cirlcleRightUp = data.cirlcleRightUp;
        mobileHeadline = data.mobileHeadline;
        mobileSubText = data.mobileSubText;
        mobileUnderCirlcle = data.mobileUnderCirlcle;
        riveSrc = data.multiplayerAnimationUrl || "/images/rive/Multiplayer_animation.riv";
    });

    // ===== REVEAL/HIDE ANIMATION (nur für Section, nicht für Kreise) =====
    let mpElement: HTMLElement;

    // ===== INDIVIDUELLE KREIS-PARALLAX-ANIMATIONEN =====
    let circle1ParallaxY = $state(0); // Hauptkreis - eigene Parallax-Animation
    let circle2ParallaxY = $state(0); // Rechts oben - eigene Parallax-Animation
    let circle3ParallaxY = $state(0); // Links unten - eigene Parallax-Animation
    let circle4ParallaxY = $state(0); // Links oben - eigene Parallax-Animation
    let circle5ParallaxY = $state(0); // Rechts mitte - eigene Parallax-Animation

    // ===== RIVE STEUERUNG =====
    let riveInstance: any; // bind:this von <MultiplayerRiveAnimation />
    let riveStarted = false;
    let mainCircleEl: HTMLDivElement;

    // ===== SCROLL-BASIERTE ANIMATION =====
    function handleMPScroll() {
        if (!mpElement) return;

        const rect = mpElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const revealPoint = viewportHeight * 0.5; // 50vh
        const hidePoint = viewportHeight * 0.8; // 80vh

        // ===== INDIVIDUELLE KREIS-PARALLAX-ANIMATIONEN =====
        // Berechne Scroll-Progress basierend auf Viewport-Position
        const scrollProgress = 2.2 * Math.max(0, (viewportHeight - rect.top) / viewportHeight);

        // Verschiedene Parallax-Geschwindigkeiten für jeden Kreis (stärker)
        circle1ParallaxY = scrollProgress * -200; // Hauptkreis - langsamste Parallax
        circle2ParallaxY = scrollProgress * -300; // Rechts oben - mittlere Parallax
        circle3ParallaxY = scrollProgress * -450; // Links unten - mittlere Parallax
        circle4ParallaxY = scrollProgress * -400; // Links oben - schnellste Parallax
        circle5ParallaxY = scrollProgress * -700; // Rechts mitte - schnelle Parallax

        // ===== RIVE START BEI 80VH TOP DES HAUPTKREISES =====
        if (mainCircleEl && riveInstance && !riveStarted) {
            const circleRect = mainCircleEl.getBoundingClientRect();
            const triggerTop = viewportHeight * 0.9; // 90vh
            if (circleRect.top <= triggerTop) {
                try {
                    riveInstance.play?.();
                    riveStarted = true;
                } catch {}
            }
        }
    }

    onMount(() => {
        window.addEventListener("scroll", handleMPScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleMPScroll);
        };
    });
</script>

<!-- ===== MULTIPLAYER SECTION ===== -->
<div class="relative">
    <!-- Content (immer sichtbar) -->
    <div bind:this={mpElement} class="relative">
        <!-- Desktop Version (2xl+) -->
        <div class="hidden 2xl:block relative z-10">
            <div class="h-200 flex justify-center items-center relative w-[1200px] mx-auto">
                <!-- Hauptkreis mit MULTI PLAYER Titel -->
                <div
                    class="absolute w-[570px] h-[570px] rounded-full bg-[#142831] flex flex-col items-center justify-center text-white transform transition-transform duration-300 ease-out"
                    bind:this={mainCircleEl}
                    style="left: 50%; top: 50%; transform: translateX(-50%) translateY({circle1ParallaxY}px);">
                    <!-- Rive Animation -->
                    <div class="mb-4 flex justify-center">
                        <MultiplayerRiveAnimation src={riveSrc} bind:this={riveInstance} />
                    </div>

                    <!-- Text -->
                    <p class="absolute top-107 font-normal text-sm text-center px-8">
                        {@html bigCirlceText}
                    </p>
                </div>

                <!-- Kleiner Kreis rechts oben -->
                <div
                    class="absolute w-[220px] h-[220px] rounded-full bg-[#142831] flex items-center justify-center text-white transform transition-transform duration-300 ease-out
                       right-[40px] top-[80%]"
                    style="transform: translateY({circle2ParallaxY}px);">
                    <p class="font-bold text-center leading-tight px-4">
                        {@html cirlcleRightUp}
                    </p>
                </div>

                <!-- Coming Soon Kreis links unten -->
                <div
                    class="absolute w-[260px] h-[260px] rounded-full bg-[#142831] flex items-center justify-center text-white transform transition-transform duration-300 ease-out
                       left-[240px] top-[160%]"
                    style="transform: translateX(-50%) translateY({circle3ParallaxY}px);">
                    <p class="text-4xl mt-3 font-bold text-center">{@html cirlcleLeftDown}</p>
                </div>

                <!-- Dekorativer Kreis links oben -->
                <div
                    class="absolute w-[150px] h-[150px] rounded-full bg-[#142831] bg-greeb-500 transform transition-transform duration-300 ease-out
                       left-[160px] top-[110%]"
                    style="transform: translateX(-50%) translateY({circle4ParallaxY}px);">
                </div>

                <!-- Dekorativer Kreis rechts mitte -->
                <div
                    class="absolute w-[100px] h-[100px] rounded-full bg-[#142831] transform transition-transform duration-300 ease-out
                       right-[160px] top-[220%]"
                    style="transform: translateX(-50%) translateY({circle5ParallaxY}px);">
                </div>
            </div>
        </div>

        <!-- Mobile Version (< 2xl) -->
        <div class="2xl:hidden relative overflow-hidden py-20">
            <!-- Hintergrund-Layer mit kreisförmiger Abrundung nach unten -->
            <div
                class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#00000000] to-[#874e43] z-0"
                style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), #874e43);">
            </div>

            <div class="text-center relative z-10">
                <p class="text-white font-bold text-lg mb-8">{mobileHeadline}</p>

                <div class="w-full flex justify-center mb-8">
                    <MultiplayerRiveAnimation src={riveSrc} />
                </div>

                <p class="text-2xl py-8 text-white font-bold">{mobileUnderCirlcle}</p>

                <p class="text-md px-10 text-white">
                    {mobileSubText}
                </p>
            </div>
        </div>
    </div>
    <!-- Ende animierter Content -->
</div>
