<script lang="ts" module>
    import { browser } from "$app/environment";
    import { writable } from "svelte/store";

    export const themes = ["dark"] as const;

    export type ITheme = (typeof themes)[number];

    type IConfig = {
        theme: ITheme;
        direction: "ltr" | "rtl";
        sidebarTheme: "light" | "dark";
        fullscreen: boolean;
    };

    const defaultConfig: IConfig = {
        theme: "dark",
        direction: "ltr",
        sidebarTheme: "dark",
        fullscreen: false,
    };

    const localStorageKey = "__NEXUS_CONFIG_v2.0__";
    const storedValue = browser && window.localStorage.getItem(localStorageKey);
    const initialValue = storedValue ? (JSON.parse(storedValue) as IConfig) : defaultConfig;
    const config = writable<IConfig>(initialValue);

    const changeTheme = (theme: IConfig["theme"]) => {
        config.update((c) => {
            return { ...c, theme };
        });
    };

    const changeSidebarTheme = (sidebarTheme: IConfig["sidebarTheme"]) => {
        config.update((c) => {
            return { ...c, sidebarTheme };
        });
    };

    const changeDirection = (direction: IConfig["direction"]) => {
        config.update((c) => {
            return { ...c, direction };
        });
    };

    const toggleFullscreen = async () => {
        const htmlRef = document.documentElement;
        if (htmlRef) {
            if (document.fullscreenElement != null) {
                await document.exitFullscreen();
            } else {
                await htmlRef.requestFullscreen();
            }
        }
        config.update((c) => {
            return { ...c, fullscreen: !c.fullscreen };
        });
    };

    const reset = () => {
        config.set(defaultConfig);
        if (document.fullscreenElement != null) {
            document.exitFullscreen();
        }
    };

    export const useConfig = () => {
        return {
            config,
            changeTheme,
            changeSidebarTheme,
            changeDirection,
            toggleFullscreen,
            reset,
        };
    };
</script>

<script lang="ts">
    let { children } = $props();

    config.subscribe((config) => {
        if (browser) {
            const htmlRef = document.documentElement;

            window.localStorage.setItem(localStorageKey, JSON.stringify(config));

            if (htmlRef) {
                htmlRef.setAttribute("data-theme", config.theme);
                if (config.fullscreen) {
                    htmlRef.setAttribute("data-fullscreen", "");
                } else {
                    htmlRef.removeAttribute("data-fullscreen");
                }
                if (config.sidebarTheme) {
                    htmlRef.setAttribute("data-sidebar-theme", config.sidebarTheme);
                }
                if (JSON.stringify(config) !== JSON.stringify(defaultConfig)) {
                    htmlRef.setAttribute("data-changed", "");
                } else {
                    htmlRef.removeAttribute("data-changed");
                }
                if (config.direction) {
                    htmlRef.dir = config.direction;
                }
            }
        }
    });

    $effect(() => {
        const fullscreenMedia = window.matchMedia("(display-mode: fullscreen)");
        const fullscreenListener = () => {
            config.update((c) => {
                return { ...c, fullscreen: fullscreenMedia.matches };
            });
        };
        fullscreenMedia.addEventListener("change", fullscreenListener);
        fullscreenListener();

        return () => {
            fullscreenMedia.removeEventListener("change", fullscreenListener);
        };
    });
</script>

{@render children()}
