<script lang="ts">
    import { Rive } from "@rive-app/canvas";
    import { onMount } from "svelte";

    export let src: string;
    let canvas: HTMLCanvasElement;
    let rive: Rive;

    export function swing() {
        if (!rive) {
            return;
        }
        rive.stop();
        rive.play("Steady_Desktop");
        requestAnimationFrame(() => {
            setTimeout(() => {
                rive.stop();
                rive.play("Swing_Desktop");
            }, 50); // shorter timeout, but after RAF
        });
    }

    export function pull() {
        if (!rive) {
            return;
        }
        rive.play("Pull_Desktop");
    }

    // ButtonText Hover-Events
    export let onButtonTextHover: ((show: boolean) => void) | undefined = undefined;

    // Scale Animation
    let isHovered = false;

    function handleMouseEnter(event: MouseEvent) {
        isHovered = true;
        if (onButtonTextHover) {
            onButtonTextHover(true);
        }
    }

    function handleMouseLeave(event: MouseEvent) {
        isHovered = false;
        if (onButtonTextHover) {
            onButtonTextHover(false);
        }
    }

    onMount(() => {
        return () => {
            rive?.cleanup();
        };
    });

    $: if (src) {
        rive = new Rive({
            src: src,
            canvas,
            autoplay: false,
            onLoad: () => {
                rive.resizeDrawingSurfaceToCanvas();
            },
        });
    }
</script>

<div class="relative">
    <canvas bind:this={canvas} class="w-[280px] aspect-video" />
    <a
        class="block h-[30%] w-[72%] absolute top-1 left-[51%] translate-x-[-50%] cursor-pointer rounded-full"
        on:click={(event) => {
            event.preventDefault();
            const element = document.getElementById("tester-registration");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }}
        on:mouseenter={(e) => {
            swing();
            handleMouseEnter(e);
        }}
        on:mouseleave={(e) => {
            pull();
            handleMouseLeave(e);
        }} />
</div>
