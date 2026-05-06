<script lang="ts">
    import type { HeadingProps, InlineNode, ModifierComponents } from "blocks-svelte-renderer";
    import { InlineRenderer } from "blocks-svelte-renderer";

    export let node: HeadingProps["node"];
    export let index: number;
    export let modifiers: ModifierComponents;

    const level = node.level ?? 1;
    const tag = `h${Math.min(Math.max(level, 1), 6)}`;
</script>

<svelte:element this={tag}>
    <InlineRenderer {modifiers} nodes={node.children} />
</svelte:element>

<style>
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-size: var(--font-size, 1rem);
        margin-bottom: var(--margin-bottom, 1rem);
    }

    h1 {
        --font-size: 1.5rem;
        --margin-bottom: 1rem;
    }
    h2 {
        --font-size: 1.25rem;
        --margin-bottom: 0.75rem;
    }
    h3 {
        --font-size: 1.125rem;
        --margin-bottom: 0.5rem;
    }
    h4 {
        --font-size: 1rem;
        --margin-bottom: 0.5rem;
    }
    h5 {
        --font-size: 0.875rem;
        --margin-bottom: 0.25rem;
    }
    h6 {
        --font-size: 0.75rem;
        --margin-bottom: 0.25rem;
    }

    @media (min-width: 640px) {
        /* sm */
        h1 {
            --font-size: 1.875rem;
            --margin-bottom: 1.25rem;
        }
        h2 {
            --font-size: 1.5rem;
            --margin-bottom: 1rem;
        }
        h3 {
            --font-size: 1.25rem;
            --margin-bottom: 0.75rem;
        }
        h4 {
            --font-size: 1.125rem;
            --margin-bottom: 0.75rem;
        }
        h5 {
            --font-size: 1rem;
            --margin-bottom: 0.5rem;
        }
        h6 {
            --font-size: 0.875rem;
            --margin-bottom: 0.5rem;
        }
    }

    @media (min-width: 768px) {
        /* md */
        h1 {
            --font-size: 2rem;
            --margin-bottom: 1.5rem;
        }
        h2 {
            --font-size: 1.875rem;
            --margin-bottom: 1.25rem;
        }
        h3 {
            --font-size: 1.5rem;
            --margin-bottom: 1rem;
        }
        h4 {
            --font-size: 1.25rem;
            --margin-bottom: 1rem;
        }
        h5 {
            --font-size: 1.125rem;
            --margin-bottom: 0.75rem;
        }
        h6 {
            --font-size: 1rem;
            --margin-bottom: 0.75rem;
        }
    }

    @media (min-width: 1024px) {
        /* lg */
        h1 {
            --font-size: 2.25rem;
            --margin-bottom: 1.75rem;
        }
        h2 {
            --font-size: 2rem;
            --margin-bottom: 1.5rem;
        }
        h3 {
            --font-size: 1.75rem;
            --margin-bottom: 1.25rem;
        }
        h4 {
            --font-size: 1.5rem;
            --margin-bottom: 1.25rem;
        }
        h5 {
            --font-size: 1.25rem;
            --margin-bottom: 1rem;
        }
        h6 {
            --font-size: 1.125rem;
            --margin-bottom: 1rem;
        }
    }

    @media (min-width: 1280px) {
        /* xl */
        h1 {
            --font-size: 3rem;
            --margin-bottom: 2rem;
        }
        h2 {
            --font-size: 2.25rem;
            --margin-bottom: 1.75rem;
        }
        h3 {
            --font-size: 2rem;
            --margin-bottom: 1.5rem;
        }
        h4 {
            --font-size: 1.75rem;
            --margin-bottom: 1.5rem;
        }
        h5 {
            --font-size: 1.5rem;
            --margin-bottom: 1.25rem;
        }
        h6 {
            --font-size: 1.25rem;
            --margin-bottom: 1.25rem;
        }
    }

    @media (min-width: 1536px) {
        /* 2xl */
        h1 {
            --font-size: 3.75rem;
            --margin-bottom: 2.25rem;
        }
        h2 {
            --font-size: 3rem;
            --margin-bottom: 2rem;
        }
        h3 {
            --font-size: 2.25rem;
            --margin-bottom: 1.75rem;
        }
        h4 {
            --font-size: 2rem;
            --margin-bottom: 1.75rem;
        }
        h5 {
            --font-size: 1.75rem;
            --margin-bottom: 1.5rem;
        }
        h6 {
            --font-size: 1.5rem;
            --margin-bottom: 1.5rem;
        }
    }
</style>
