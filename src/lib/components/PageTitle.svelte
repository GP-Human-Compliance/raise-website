<script lang="ts">
    export type IBreadcrumbItem = {
        label: string;
        path?: string;
        active?: boolean;
    };

    type IPageTitle = {
        items?: IBreadcrumbItem[];
        title: string;
        centerItem?: any;
    };

    let { items, centerItem, title }: IPageTitle = $props();
</script>

<div class="flex items-center justify-between">
    <h3 class="text-lg font-medium">{title}</h3>
    {#if centerItem}
        {centerItem}
    {/if}
    {#if items}
        <div class="breadcrumbs hidden p-0 text-sm sm:inline">
            <ul>
                <li>
                    <a href="/dashboards/forge">raise</a>
                </li>
                {#each items as item, index (index)}
                    <li class={`${item.active ? "opacity-80" : ""}`}>
                        {#if item.path}
                            <a href={item.path}>
                                {item.label}
                            </a>
                        {:else}
                            {item.label}
                        {/if}
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>
