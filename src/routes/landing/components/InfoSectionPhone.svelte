<script lang="ts">
    import { Rive } from "@rive-app/canvas";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    export let inView: boolean = false;
    export let elements: any[];
    export let src: string = "";

    export let desktopHeadline = "";
    export let desktopSubHeading = "";

    export let phoneImageUrl = "";
    export let arrowUpImageUrl = "";
    export let arrowDownImageUrl = "";

    let canvas: HTMLCanvasElement;
    let rive: Rive;
    let currentAnimation = 100;
    let scrollContainer: HTMLElement;
    let inputNumber: any;
    let isPlaying = false;
    let currentElementIndex = 0;

    let oldScrollTop = 0;
    let scrollContainerHeight = 10000;

    let animationNames = [100, 200, 300, 400, 500];
    let scrollDirectionDown = true;
    let scrollDelay = 1000

    $: inAnimation = { x: 0, y: 20 * (!scrollDirectionDown ? -1 : 1), duration: 400, delay: 1000 };
    $: outAnimation = { x: 0, y: 20 * (scrollDirectionDown ? -1 : 1), duration: 400 };

    $: if (rive && inView) {
        setTimeout(() => {
            play();
            scrollDelay = 1700
        }, 500);
    }

    $: if (src) {
        rive = new Rive({
            src: src,
            canvas,
            autoplay: true,
            stateMachines: "State Machine 1",
            onLoad: () => {
                rive.resizeDrawingSurfaceToCanvas();
                const inputs = rive.stateMachineInputs("State Machine 1");
                inputNumber = inputs.find((i) => i.name === "Number_1");
            },
        });
    }

    function onScroll() {
        let scrollTop = scrollContainer.scrollTop;
        if (!isPlaying) {
            if (scrollTop > oldScrollTop) {
                scrollDirectionDown = true;
                next();
            } else {
                scrollDirectionDown = false;
                previous();
            }
            oldScrollTop =
                currentAnimation === 500
                    ? scrollContainerHeight
                    : currentAnimation === 100
                      ? 0
                      : scrollContainerHeight / 2;
        } else {
            scrollContainer.scrollTop =
                currentAnimation === 500
                    ? scrollContainerHeight
                    : currentAnimation === 100
                      ? 0
                      : scrollContainerHeight / 2;
        }
    }

    function next() {
        if (isPlaying) {
            return;
        }
        switch (currentAnimation) {
            case 0:
                currentAnimation = 100;
                currentElementIndex = 0;
                break;
            case 100:
                currentAnimation = 200;
                currentElementIndex = 1;
                break;
            case 200:
                currentAnimation = 300;
                currentElementIndex = 2;
                break;
            case 300:
                currentAnimation = 400;
                currentElementIndex = 3;
                break;
            case 400:
                currentAnimation = 500;
                currentElementIndex = 4;
                break;
            default:
                break;
        }
        play();
    }

    function previous() {
        if (isPlaying) {
            return;
        }
        switch (currentAnimation) {
            case 500:
                currentAnimation = 400;
                currentElementIndex = 3;
                break;
            case 400:
                currentAnimation = 300;
                currentElementIndex = 2;
                break;
            case 300:
                currentAnimation = 200;
                currentElementIndex = 1;
                break;
            case 200:
                currentAnimation = 100;
                currentElementIndex = 0;
                break;
            default:
                break;
        }
        play();
    }

    function play() {
        if (!rive) {
            return;
        }
        isPlaying = true;
        inputNumber.value = currentAnimation;
        setTimeout(() => {
            isPlaying = false;
        }, scrollDelay);
    }

    onMount(() => {
        return () => {
            rive.cleanup();
        };
    });
</script>

<div class="relative flex items-center z-1">
    <!-- SCROLL CONTAINER -->
    <div
        bind:this={scrollContainer}
        class="absolute h-full w-[100%] overflow-scroll no-scrollbar z-4 rounded-r-full
            transform transition ease-in-out
            {inView
            ? 'opacity-100 translate-y-0 duration-1000 delay-500'
            : 'opacity-0 translate-x-[-10%] duration-400'}"
        on:scroll={onScroll}>
        <div style="height: {scrollContainerHeight}px;"></div>
    </div>
    <div
        class="relative z-2
        transform transition duration-600 ease-in-out
        {inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[40%] delay-400'}">
        <img src={phoneImageUrl} class="h-[812px] w-[402px]" />
        <div class="absolute top-[17px] left-[23px]">
            <canvas
                bind:this={canvas}
                class="bg-gradient-to-bl from-[#2c3d47] to-[#874e43] h-[778px] w-[358px] rounded-[50px]" />
        </div>
    </div>

    <div
        class="
            absolute top-24 left-[270px] z-3
            transform transition ease-in-out
            {inView
            ? 'opacity-100 translate-y-0 duration-1000 delay-700'
            : 'opacity-0 translate-x-[-40%] duration-400'}">
        <h2 class="text-5xl font-bold">{desktopHeadline}</h2>
        <h3 class="text-xl font-bold">{desktopSubHeading}</h3>
    </div>

    <div
        class="absolute left-150 text-center z-4 pointer-events-none
                transform transition ease-in-out
                {inView ? 'opacity-100 duration-1000 delay-800' : 'opacity-0 delay-200'}">
        <div
            class="transform transition ease-in-out
                {inView && currentAnimation !== 100
                ? 'pointer-events-auto opacity-100 translate-y-[-210%] duration-400 delay-1200'
                : 'opacity-0 translate-y-[-100%] duration-200 delay-800'}">
            <button
                on:click={previous}
                class="w-10 h-10 translate-y-2 flex justify-center items-center rounded-full cursor-pointer hover:opacity-60">
                <img src={arrowUpImageUrl} alt="Zurück" class="w-6 h-6 filter brightness-0 invert" />
            </button>
        </div>

        <div
            class="transform transition ease-in-out
                {inView && currentAnimation !== 500
                ? 'pointer-events-auto opacity-100 translate-y-[180%] duration-400 delay-1200'
                : 'opacity-0 translate-y-[100%] duration-200 delay-800'}">
            <button
                on:click={next}
                class="w-10 h-10 flex justify-center items-center rounded-full cursor-pointer hover:opacity-60">
                <img src={arrowDownImageUrl} alt="Weiter" class="w-6 h-6 filter brightness-0 invert" />
            </button>
        </div>
    </div>
    <div
        class="
            flex items-center content-center
            pl-[334px] rounded-full w-[800px] h-[800px] ml-[-280px]
            bg-gradient-to-bl from-secondary/70 to-secondary/90 shadow-lg backdrop-blur-md
            transform transition ease-in-out
            {inView
            ? 'opacity-100 translate-y-0 duration-1000 delay-500'
            : 'opacity-0 translate-x-[-10%] duration-400'}">
        <div
            class="
                transform transition duration-600 delay-800 ease-in-out
                {inView ? 'opacity-100' : 'opacity-0'}">
            {#each animationNames as item, index (index)}
                <div
                    class="
                        w-4 rounded-full hover:bg-white/60
                        transform transition-[height,background] duration-600 delay-600 ease-in-out shadow shadow-gray-300
                        {currentAnimation === item ? 'bg-gray-200 h-8' : 'h-4 bg-gray-400'}">
                </div>
            {/each}
        </div>

        <div class="px-12 h-50 w-85 relative flex items-center">
            {#key currentElementIndex}
                <div in:fly={inAnimation} out:fly={outAnimation} class="text-left absolute">
                    <div class="flex items-center">
                        <div class="w-8 h-8 flex items-center justify-center">
                            <img
                                src={elements[currentElementIndex]?.icon}
                                alt={elements[currentElementIndex]?.title}
                                class="w-6 h-6 filter brightness-0 invert" />
                        </div>

                        <h4 class="text-2xl font-bold text-white uppercase">
                            {elements[currentElementIndex]?.title || "THEMA"}
                        </h4>
                    </div>
                    <p class="text-white text-base leading-relaxed mt-4">
                        {elements[currentElementIndex]?.text ||
                            "Zuerst legst du dein Thema fest. Die AI hilft dir den Kern deiner Frage zu finden."}
                    </p>
                </div>
            {/key}
        </div>
    </div>
</div>

<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }

    .no-scrollbar {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }
</style>
