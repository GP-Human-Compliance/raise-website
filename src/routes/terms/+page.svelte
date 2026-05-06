<script lang="ts">
    import Heading from "$lib/components/blocks/Heading.svelte";
    import { fetchLegal } from "$lib/strapiClient";
    import { BlocksRenderer } from "blocks-svelte-renderer";

    let strapiData: any = null;

    fetchLegal()
        .then((data) => {
            strapiData = data;
        })
        .catch((err) => console.log(err));
</script>

<div class="bg-[#142831CC] min-h-screen">
    <div class="container w-fit">
        <div class="p-2 md:pl-20 md:pr-20 lg:pl-60 lg:pr-60">
            <h1 class="pt-16 pb-16 text-xl sm:text-2xl md:text-4xl lg:text-6xl text-center font-bold">
                {strapiData?.data?.title}
            </h1>
            <BlocksRenderer
                blocks={{
                    heading: Heading,
                }}
                content={strapiData?.data?.content} />
        </div>
    </div>
</div>
