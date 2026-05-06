<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";
    import LocalStorageUtil from "$lib/localStorageUtil";
    import { fetchLogo, getStrapiBaseUrl, fetchTopBarData } from "$lib/strapiClient.js";
    import type { Locale } from "$lib/types";
    import { fly } from "svelte/transition";

    let scrollPosition = $state(0);
    let scrolling = $state<"up" | "down" | undefined>(undefined);
    let prevScrollPosition = $state(0);
    let logoData: any = $state(null);
    let isMinimized = $state(false);
    let isAnimating = $state(false);
    let isMobileMenuOpen = $state(false);

    // Navigation Links
    let navigationLinks: { id: string; label: string }[] = $state([]);
    let testerRegistrationButtonText: string = $state("");
    let mobileMenueButtonCloseText: string = $state("");
    let bugReportButtonText: string = $state("");

    function setLanguage(locale: Locale) {
        LocalStorageUtil.setLocale(locale);
        window.location.href = window.location.pathname;
    }

    fetchLogo()
        .then((data) => (logoData = data))
        .catch(() => {});

    fetchTopBarData()
        .then((data) => {
            navigationLinks = data.navigationLinks;
            testerRegistrationButtonText = data.testerRegistrationButtonText;
            mobileMenueButtonCloseText = data.mobileMenueButtonCloseText;
            bugReportButtonText = data.bugReportButtonText;
        })
        .catch(() => {});

    // Mobile Menu Toggle
    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }

    function closeMobileMenu() {
        isMobileMenuOpen = false;
    }

    const handleScroll = () => {
        setTimeout(() => {
            prevScrollPosition = scrollPosition;
            scrollPosition = window.scrollY;

            // Easing-Logik: ease-in zum Minimieren, ease-out zum Maximieren
            const shouldMinimize = scrollPosition > 0;
            if (shouldMinimize !== isMinimized && !isAnimating) {
                isAnimating = true;
                isMinimized = shouldMinimize;

                // Animation beendet nach 300ms
                setTimeout(() => {
                    isAnimating = false;
                }, 300);
            }
        }, 200);
    };

    $effect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        if (scrollPosition < 500) {
            scrolling = undefined;
        } else {
            if (scrollPosition - prevScrollPosition > 0) {
                scrolling = "down";
            } else if (scrollPosition - prevScrollPosition < 0) {
                scrolling = "up";
            }
        }

        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        }
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });
</script>

<div
    data-scrolling={scrolling}
    data-at-top={scrollPosition < 5}
    class="fixed inset-x-0 top-0 px-3 flex justify-center transition-all duration-300 {isMinimized
        ? 'h-14 md:h-20 bg-[#152933cc] backdrop-blur-md'
        : 'h-16 md:h-30 bg-[#152933]'}"
    style="
        transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    ">
    <!-- class="group-data-[at-top=false]:bg-[#142831CC] group-data-[at-top=false]:dark:bg-base-200  -->
    <div class="flex w-full max-w-[1084px] items-center justify-between px-0 md:px-6 py-3 md:h-full">
        <!-- Logo links -->
        <div class="flex items-center">
            <Logo
                contentClass={`transition-all duration-300 transition-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isMinimized ? "h-6 sm:h-7 md:h-8 lg:h-9" : "h-6 sm:h-9 md:h-10 lg:h-11"}`} />
        </div>

        <!-- Desktop Navigation (hidden on mobile) -->
        <div class="hidden md:flex items-center space-x-10">
            <button
                class="hover:text-[#4FCAA7] transition-all duration-300 {isMinimized
                    ? 'text-sm lg:text-base'
                    : 'text-base lg:text-lg'}"
                style="transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);"
                on:click={() => setLanguage(LocalStorageUtil.getLocale() === "de" ? "en" : "de")}>
                <span class={`${LocalStorageUtil.getLocale() === "de" ? "font-bold" : "font-light"}`}>DE</span>
                <span class="font-light"> / </span>
                <span class={`${LocalStorageUtil.getLocale() === "en" ? "font-bold" : "font-light"}`}>EN</span>
            </button>
            <a
                href="#bugreport"
                class="transition-all duration-300 hover:text-[#4FCAA7] cursor-pointer {isMinimized
                    ? 'text-sm lg:text-base'
                    : 'text-base lg:text-lg'}"
                style="
                transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
            ">
                {bugReportButtonText}
            </a>
            <a
                href="#tester-registration"
                class="btn btn-primary text-[#142831] transition-all duration-300 {isMinimized
                    ? 'text-sm lg:text-base'
                    : 'text-base lg:text-lg'}"
                style="
                    border-radius: 12px;
                    padding: {isMinimized ? '8px 16px' : '12px 24px'};
                    transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                ">
                {testerRegistrationButtonText}
            </a>
        </div>

        <!-- Mobile Navigation (visible on mobile) -->
        <div class="flex md:hidden items-center justify-center flex-1">
            <!-- Button in der Mitte -->
            <a
                class="btn btn-primary text-[#142831] transition-all duration-300 h-6"
                style="
                    border-radius: 12px;
                    padding: {isMinimized ? '2px 12px' : '4px 12px'};
                    font-size: {isMinimized ? '10px' : '12px'};
                    transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                "
                on:click={(event) => {
                    event.preventDefault();
                    const element = document.getElementById("tester-registration");
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                }}>
                {testerRegistrationButtonText}
            </a>
        </div>

        <!-- Mobile Right Side (Sprachauswahl + Burger) -->
        <div class="flex md:hidden items-center space-x-4">
            <!-- Sprachauswahl -->
            <button
                class="transition-all duration-300"
                style="font-size: {isMinimized
                    ? '14px'
                    : '16px'};transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);"
                on:click={() => setLanguage(LocalStorageUtil.getLocale() === "de" ? "en" : "de")}>
                <span class={`${LocalStorageUtil.getLocale() === "de" ? "font-bold" : "font-light"}`}>DE</span>
                <span class="font-light"> / </span>
                <span class={`${LocalStorageUtil.getLocale() === "en" ? "font-bold" : "font-light"}`}>EN</span>
            </button>

            <!-- Burger Menu -->
            <button
                on:click={toggleMobileMenu}
                class="flex flex-col justify-center items-center w-8 h-8 transition-all duration-300"
                style="
                    transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                ">
                <span
                    class="block w-6 h-0.5 bg-white mb-1 transition-all duration-300 {isMobileMenuOpen
                        ? 'rotate-45 translate-y-1.5'
                        : ''}"></span>
                <span
                    class="block w-6 h-0.5 bg-white mb-1 transition-all duration-300 {isMobileMenuOpen
                        ? 'opacity-0'
                        : ''}"></span>
                <span
                    class="block w-6 h-0.5 bg-white transition-all duration-300 {isMobileMenuOpen
                        ? '-rotate-45 -translate-y-1.5'
                        : ''}"></span>
            </button>
        </div>
    </div>

    <!-- Mobile Menu Overlay -->
    {#if isMobileMenuOpen}
        <div
            in:fly={{ x: 300, duration: 300 }}
            out:fly={{ x: 300, duration: 300 }}
            class="fixed inset-0 h-[100vh] bg-[#000000e5] backdrop-blur-sm md:hidden">
            <div class="flex flex-col justify-center h-full">
                <!-- Navigation Links -->
                <div class="flex flex-col justify-center items-center px-8">
                    {#each navigationLinks as link}
                        <a
                            on:click={(event) => {
                                event.preventDefault();
                                closeMobileMenu();
                                const element = document.getElementById(link.id);
                                if (element) {
                                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                                }
                            }}
                            class="text-white w-full text-center text-2xl mt-8 font-medium hover:text-[#4FCAA7] transition-colors">
                            {link.label}
                        </a>
                    {/each}
                </div>
                <!-- Close Button (sticky bottom) -->
                <div class="sticky bottom-0 p-8 mt-20">
                    <button
                        on:click={closeMobileMenu}
                        class="w-full bg-[#4FCAA7] text-[#142831] py-4 px-8 rounded-lg text-lg font-medium hover:bg-[#3BA896] transition-colors">
                        {mobileMenueButtonCloseText}
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>
