<script lang="ts">
    import { Alignment, Fit, Layout, Rive } from "@rive-app/canvas";
    import { onMount } from "svelte";
    import { inview } from "svelte-inview";

    export let src;

    let canvas: HTMLCanvasElement;
    let rive: Rive;
    let isLoaded = false;

    const STATE_MACHINE = "State Machine 1";

    // Exponiere eine Start-Funktion, die von außen aufgerufen werden kann
    export function play() {
        if (!rive) {
            return;
        }
        rive?.play();
    }

    onMount(() => {
        return () => {
            rive?.cleanup();
        };
    });

    let inView = false;
    $: if (inView) {
        play();
    }

    $: if (src) {
        const initRive = () => {
            rive = new Rive({
                src: src,
                canvas,
                autoplay: false,
                stateMachines: STATE_MACHINE, // State Machine verwenden
                layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
                onLoad: () => {
                    isLoaded = true;
                    rive.resizeDrawingSurfaceToCanvas();
                },
            });
        };

        // Versuche sofort
        initRive();

        // Falls nicht sofort verfügbar, warte kurz
        if (!canvas) {
            setTimeout(initRive, 200);
        }

        window.addEventListener("resize", () => rive?.resizeDrawingSurfaceToCanvas());
    }
</script>

<div
    use:inview={{ unobserveOnEnter: false, threshold: 0.9 }}
    on:inview_change={(event: any) => {
        inView = event.detail.inView;
    }}>
    <!-- Rive Animation Canvas (darüber gelegt wenn geladen) -->
    <canvas bind:this={canvas} class="w-[95vw] 2xl:w-[480px] pointer-events-none aspect-video bg-blacks"></canvas>
</div>

<style>
</style>
