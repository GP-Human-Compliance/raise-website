<script lang="ts">
    import { inview } from "svelte-inview";

    // Props für Kreis-Konfiguration
    export let triggerAnimation: boolean | undefined = undefined;
    export let radius: string;
    export let positionX: string;
    export let positionY: string;
    export let animateToClass: string;
    export let animateFromClass: string;
    export let duration: number = 1200;
    export let transitionTimingFunction: string = "ease-in-out";
    export let contentClass: string = "bg-secondary";

    let inView = false;

    // Externe Animation-Trigger überschreibt lokale Viewport-Detection
    $: if (triggerAnimation) {
        inView = triggerAnimation
    }
</script>

<!-- Kreis-Container -->
<div
    use:inview={{ 
        unobserveOnEnter: true,
        threshold: 1,
        rootMargin: "-30px"
    }}
    on:inview_change={(event: any) => {
        if (triggerAnimation !== undefined) {
            return;
        }
        inView = event.detail.inView;
    }}
    class="
        absolute
        rounded-full
        flex flex-col justify-center items-center text-center px-8
        {contentClass}
        {inView ? animateToClass : animateFromClass}"
    style="
        width: {radius};
        height: {radius};
        left: {positionX}%;
        top: {positionY}%;
        transform: translate(-50%, -50%);
        transition: all {duration}ms {transitionTimingFunction}">
    
    <slot />
</div>