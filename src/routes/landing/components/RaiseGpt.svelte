<script lang="ts">
    // ─────────────────────────────────────────────────────────────────────
    //  raiseGPT — compact promo card (sits between the app-store CTA and the
    //  bug-report section).
    //
    //  Design intent:
    //   • Outer card stays in the WEBSITE's style so it feels organic —
    //     translucent topbar-navy panel, Outfit type. Accent colours are
    //     ORANGE (#ff6f4c, the site's coral) + BLUE (#2E7DFF), both already
    //     present in the page's background gradient.
    //   • The browser preview inside adopts raiseGPT's own UI: the white
    //     wordmark and the app's real background gradient
    //     (#345268 blue → #93605B terracotta), with text-only chat.
    //
    //  Prototype copy is inline (DE/EN); productionising = move it into the
    //  Strapi/JSON content layer like the other sections.
    // ─────────────────────────────────────────────────────────────────────
    import { base } from "$app/paths";
    import LocalStorageUtil from "$lib/localStorageUtil";
    import { inview } from "svelte-inview";
    import { onMount } from "svelte";

    const APP_URL = "https://yourstodecide.de";
    const locale = LocalStorageUtil.getLocale() === "en" ? "en" : "de";

    const copy = {
        de: {
            tagline: "yours to decide.",
            body: "Lieber sofort loslegen? Der ganze RAISE-Prozess als KI-Assistent – direkt im Browser, ohne App-Store.",
            cta: "raiseGPT öffnen",
        },
        en: {
            tagline: "yours to decide.",
            body: "Rather start right away? The full RAISE process as an AI assistant – straight in your browser, no app store.",
            cta: "Open raiseGPT",
        },
    }[locale];

    // ── Text-only scripted demo ─────────────────────────────────────────────
    type Msg = { role: "user" | "bot"; text: string };

    const script: Record<"de" | "en", Msg[]> = {
        de: [
            { role: "user", text: "Neuer Job – ja oder nein?" },
            { role: "bot", text: "Lass es uns strukturieren: Was zählt für dich am meisten – Gehalt, Sinn oder Team?" },
            { role: "user", text: "Sinn. Aber das Gehalt reizt." },
            { role: "bot", text: "Verstanden. Nach deiner Gewichtung liegt der neue Job vorn. Ob du springst? Das entscheidest du." },
        ],
        en: [
            { role: "user", text: "New job – yes or no?" },
            { role: "bot", text: "Let's structure it: what matters most to you – salary, meaning or team?" },
            { role: "user", text: "Meaning. But the salary is tempting." },
            { role: "bot", text: "Got it. Weighted your way, the new job leads. Whether you leap? That's yours to decide." },
        ],
    };

    const messages = script[locale];

    let revealed = $state(0);
    let typing = $state(false);
    let started = false;
    let screenEl: HTMLDivElement | undefined = $state();

    function scrollToBottom() {
        requestAnimationFrame(() => {
            if (screenEl) screenEl.scrollTop = screenEl.scrollHeight;
        });
    }

    function schedule(i: number) {
        if (i >= messages.length) {
            setTimeout(() => {
                revealed = 0;
                schedule(0);
            }, 3800);
            return;
        }
        const m = messages[i];
        const think = m.role === "bot" ? 1000 : 550;
        typing = m.role === "bot";
        setTimeout(() => {
            typing = false;
            revealed = i + 1;
            scrollToBottom();
            setTimeout(() => schedule(i + 1), m.role === "user" ? 450 : 1250);
        }, think);
    }

    function play() {
        if (started) return;
        started = true;
        schedule(0);
    }

    onMount(() => {
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (reduce) {
            revealed = messages.length;
            started = true;
        }
    });
</script>

<section id="raisegpt" class="w-full scroll-mt-30 px-4 sm:px-6">
    <div
        use:inview={{ threshold: 0.3, unobserveOnEnter: true }}
        on:inview_enter={play}
        class="mx-auto w-full max-w-[1066px]">
        <!-- "oder" connector — ties this card to the "Jetzt testen" card above -->
        <div class="mx-auto mb-8 flex max-w-[560px] items-center gap-4">
            <span class="h-px flex-1 bg-white/15"></span>
            <span class="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">{locale === "de" ? "oder" : "or"}</span>
            <span class="h-px flex-1 bg-white/15"></span>
        </div>
        <div
            class="relative overflow-hidden rounded-[28px] border border-black/5 shadow-xl">
            <!-- Tint + backdrop-blur live on a CHILD, so the parent's rounded
                 overflow-hidden clips them cleanly. A backdrop-filter applied
                 to the rounded element itself leaks into the square corners
                 in Chromium — that was the "bleeding corners". -->
            <div class="absolute inset-0 bg-white"></div>
            <!-- dual glow: orange + blue (echoes the page gradient) -->
            <div class="pointer-events-none absolute inset-0">
                <div class="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#ff6f4c]/25 blur-3xl"></div>
                <div class="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#2E7DFF]/25 blur-3xl"></div>
            </div>

            <div class="relative flex flex-col items-center gap-8 px-6 py-8 sm:px-10 sm:py-9 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
                <!-- ── Copy ─────────────────────────────────────────── -->
                <div class="max-w-[42ch] text-center lg:text-left">
                    <!-- "NEU" pill (bordered white chip, black text, orange live dot) -->
                    <span
                        class="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#142831]">
                        <span class="relative flex h-1.5 w-1.5">
                            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff6f4c] opacity-75"></span>
                            <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ff6f4c]"></span>
                        </span>
                        {locale === "de" ? "Neu" : "New"}
                    </span>

                    <!-- raiseGPT wordmark (dark, for the white card) -->
                    <img
                        src="{base}/images/raisegpt/raisegpt-dark.svg"
                        alt="raiseGPT"
                        class="mx-auto mt-4 h-7 w-auto sm:h-8 lg:mx-0" />

                    <p class="mt-2.5 text-xl font-semibold text-[#ff6f4c] sm:text-2xl">{copy.tagline}</p>

                    <p class="mt-3 text-sm text-[#4a5560] sm:text-base">{copy.body}</p>

                    <div class="mt-5 flex flex-col items-center gap-2.5 sm:flex-row sm:justify-center lg:justify-start">
                        <a
                            href={APP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="group inline-flex items-center justify-center gap-2 bg-[#4FCAA7] px-6 py-3 text-sm font-semibold text-[#142831] shadow-lg shadow-[#4FCAA7]/25 transition-colors hover:bg-[#3BA896]"
                            style="border-radius: 12px;">
                            {copy.cta}
                            <span class="icon-[lucide--arrow-up-right] text-lg transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"></span>
                        </a>
                        <a
                            href={APP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 font-mono text-xs text-[#8a939c] transition-colors hover:text-[#2f9d82]">
                            <span class="icon-[lucide--lock] text-[10px]"></span>
                            yourstodecide.de
                        </a>
                    </div>
                </div>

                <!-- ── Mini browser demo (raiseGPT's real gradient bg) ── -->
                <div class="w-full max-w-[300px] shrink-0">
                    <div class="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/10">
                        <!-- chrome -->
                        <div class="flex items-center gap-1.5 border-b border-black/5 bg-[#eef0f2] px-3 py-2">
                            <span class="h-2 w-2 rounded-full bg-[#ff5f57]"></span>
                            <span class="h-2 w-2 rounded-full bg-[#febc2e]"></span>
                            <span class="h-2 w-2 rounded-full bg-[#28c840]"></span>
                            <div class="ml-1.5 flex flex-1 items-center gap-1.5 rounded bg-white px-2 py-1 text-[10px] text-[#5b6570]">
                                <span class="icon-[lucide--lock] text-[8px] text-[#28a06a]"></span>
                                <span class="font-medium">yourstodecide.de</span>
                            </div>
                        </div>

                        <!-- screen — raiseGPT original background gradient -->
                        <div
                            bind:this={screenEl}
                            class="flex h-[208px] flex-col gap-2 overflow-hidden p-3"
                            style="background: linear-gradient(180deg, #345268 0%, #345268 55%, #93605B 100%);">
                            {#each messages.slice(0, revealed) as m, i (i)}
                                {#if m.role === "user"}
                                    <div class="flex justify-end">
                                        <div class="max-w-[85%] rounded-xl rounded-br-sm bg-[#142831] px-3 py-1.5 text-xs leading-snug text-white shadow-md">
                                            {m.text}
                                        </div>
                                    </div>
                                {:else}
                                    <div class="flex items-start gap-1.5">
                                        <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#142831] text-[11px] font-bold text-white shadow-sm">r</span>
                                        <div class="max-w-[88%] rounded-xl rounded-tl-sm bg-white px-3 py-2 text-xs leading-snug text-[#1e2328] shadow-md">
                                            {m.text}
                                        </div>
                                    </div>
                                {/if}
                            {/each}

                            {#if typing}
                                <div class="flex items-start gap-1.5">
                                    <span class="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#142831] text-[11px] font-bold text-white shadow-sm">r</span>
                                    <div class="flex items-center gap-1 rounded-xl rounded-tl-sm bg-white px-3 py-2.5 shadow-md">
                                        <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9aa4ad] [animation-delay:-0.3s]"></span>
                                        <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9aa4ad] [animation-delay:-0.15s]"></span>
                                        <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9aa4ad]"></span>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
