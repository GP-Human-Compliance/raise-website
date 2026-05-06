<script lang="ts">
    import { fetchLogo, getStrapiBaseUrl } from "$lib/strapiClient";

    export let contentClass = "";

    let logoData: any = null;

    fetchLogo()
        .then((data) => (logoData = data))
        .catch(() => {});

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
</script>

<div class="inline cursor-pointer" on:click={scrollToTop}>
    <img
        src={logoData?.data?.LogoUrl?.url ? `${getStrapiBaseUrl()}${logoData.data.LogoUrl.url}` : ""}
        alt={logoData?.data?.Alttext || "Logo"}
        class="w-auto {contentClass}" />
</div>
