<script lang="ts">
    import ConfigProvider from "$lib/contexts/ConfigProvider.svelte";
    import "$lib/styles/app.css";

    let { children } = $props();
</script>

<svelte:head>
    <title>RAISE</title>
</svelte:head>
<ConfigProvider>
    {@render children()}
</ConfigProvider>
