<script lang="ts">
    import { base } from "$app/paths";
    import { fetchVideo } from "$lib/strapiClient";
    import { onMount } from "svelte";
    import { inview } from "svelte-inview";

    let scrollY = $state(0);

    let played = $state(false);
    let youtubeId: string = $state("");
    let videoSubline: string = $state("");

    let inView = $state(false);

    let scale = $derived(!inView ? 1 : 1 - scrollY * 0.0008);

    onMount(() => {
        fetchVideo().then((res) => {
            youtubeId = res.data?.youtubeId ?? "";
            videoSubline = res.data?.videoSubline ?? "";
        });
    });

    function play() {
        played = true;
    }
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
        <div class="w-full h-full relative aspect-video">
            {#if !played}
                <button
                    type="button"
                    on:click={play}
                    class="absolute inset-0 w-full h-full cursor-pointer group"
                    aria-label="Video abspielen (lädt YouTube)">
                    <img
                        src="{base}/images/video_thumb.jpg"
                        alt=""
                        class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-black/10 flex items-center justify-center transition group-hover:bg-black/20">
                        <span class="w-20 h-20 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm">
                            <img src="{base}/images/play_icon.svg" alt="" class="h-10 w-10" />
                        </span>
                    </div>
                    <div class="absolute bottom-2 right-2 text-[10px] md:text-xs px-2 py-1 rounded bg-black/50 text-white pointer-events-none">
                        Beim Abspielen wird eine Verbindung zu YouTube hergestellt.
                    </div>
                </button>
            {:else if youtubeId}
                <iframe
                    title="raise video"
                    class="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowfullscreen
                    referrerpolicy="strict-origin-when-cross-origin"
                    loading="lazy"></iframe>
            {/if}
        </div>
    </div>
    <div class="pt-20" style="transform: translateY({scrollY * -0.2}px);">{videoSubline}</div>
</div>
