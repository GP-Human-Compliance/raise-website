<script lang="ts">
    import { fetchVideo, getStrapiBaseUrl } from "$lib/strapiClient";
    import { onMount } from "svelte";
    import { inview } from "svelte-inview";

    let scrollY = $state(0);

    let video: HTMLVideoElement;
    let played = $state(false);
    let videoUrl: string = $state("");

    let inView = $state(false);
    let videoPlayerInView = $state(false);
    let videoSubline: string = $state("");

    let scale = $derived(!inView ? 1 : 1 - scrollY * 0.0008);

    onMount(() => {
        fetchVideo().then((res) => {
            videoUrl = getStrapiBaseUrl() + res.data.Video.url;
            videoSubline = res.data.videoSubline;
        });
    });

    $effect(() => {
        if (!videoPlayerInView) {
            video?.pause();
        }
    });
</script>

<svelte:window bind:scrollY />

<div
    use:inview={{ unobserveOnEnter: false, threshold: 0 }}
    on:inview_change={(event: any) => {
        inView = event.detail.inView;
    }}
    class="
        px-8 xl:px-0 text-center
        transform transition duration-600 ease-in-out {inView
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-8'}">
    <div
        class="overflow-hidden rounded-xl z-10 text-center text-black aspect-video max-w-[1065px] mx-auto bg-white"
        style="transform: scale({scale});">
        <div class="w-full min-h-[600px] relative">
            <video
                use:inview={{ unobserveOnEnter: false, threshold: 0.9 }}
                on:inview_change={(event: any) => {
                    videoPlayerInView = event.detail.inView;
                }}
                bind:this={video}
                controls={played}
                src={videoUrl}
                class="rounded-lg"></video>

            {#if !played}
                <div class="absolute top-0 left-0 w-full flex items-center justify-center bg-black/10 aspect-video">
                    <button
                        on:click={() => {
                            played = true;
                            video.play();
                        }}
                        class="text-2xl hover:bg-black/10 cursor-pointer w-20 h-20 rounded-full">
                        <img src="/images/play_icon.svg" alt="play video button icon" class="h-full w-full" />
                    </button>
                </div>
            {/if}
        </div>
    </div>
    <div class="pt-20" style="transform: translateY({scrollY * -0.2}px);">{videoSubline}</div>
</div>
