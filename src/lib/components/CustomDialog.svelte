<script lang="ts">
    import LocalStorageUtil from "$lib/localStorageUtil";
    import { BlocksRenderer } from "blocks-svelte-renderer";
    import { onMount } from "svelte";
    import Heading from "./blocks/Heading.svelte";

    export let open: boolean = false;
    export let onClose: VoidFunction;
    export let fetchFunction: Function;

    let strapiData: any = null;

    let titleElement: HTMLElement;

    async function load() {
        try {
            const data = await fetchFunction();
            strapiData = data;
        } catch (error) {
            console.log(error);
        }
    }

    let dialogRef: HTMLDialogElement | null = null;

    onMount(async () => {
        await load();
    });

    $: if (dialogRef && open && !dialogRef.open) {
        dialogRef.showModal();
        titleElement.scrollIntoView({ behavior: "instant", block: "start" });
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
    }

    function handleClose() {
        onClose();
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
    }
</script>

<dialog
    bind:this={dialogRef}
    on:close={() => handleClose()}
    on:click|self={() => dialogRef?.close()}
    class="dialog mx-auto top-[50%] translate-y-[-50%] text-black round-2xl md:rounded-4xl bg-gradient-to-tl from-[#EAD8D6] to-[#E7EBF7]">
    <div class="h-[65vh] md:h-[80vh] container overflow-scroll">
        <h1 class="text-xl sm:text-2xl md:text-4xl lg:text-6xl text-center font-bold pt-10" bind:this={titleElement}>
            {strapiData?.data?.title}
        </h1>
        <div class="w-fit m-5">
            <BlocksRenderer
                blocks={{
                    heading: Heading,
                }}
                content={strapiData?.data?.content} />
        </div>
    </div>
    <div class="h-[70px] bg-[#00000022] flex items-center px-5">
        <button class="btn flex-12/12" on:click={() => dialogRef?.close()}
            >{LocalStorageUtil.getLocale() === "de" ? "Schließen" : "Close"}</button>
    </div>
</dialog>

<style>
    .dialog::backdrop {
        background-color: #000000dd;
    }
</style>
