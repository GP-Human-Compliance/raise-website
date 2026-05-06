<script lang="ts">
    import { fetchBugReport } from "$lib/strapiClient";
    import { onMount } from "svelte";

    // ===== REVEAL/HIDE ANIMATION =====
    let bugReportElement: HTMLElement;
    let bugReportOpacity = $state(0);
    let bugReportTranslateY = $state(50);
    let bugReportInView = $state(false);
    let mailtoLink = $state("");
    let buttonText = $state("");
    let textUnderButton = $state("");
    let subText = $state("");

    // ===== SCROLL-BASIERTE ANIMATION =====
    function handleBugReportScroll() {
        if (!bugReportElement) return;

        const rect = bugReportElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const revealPoint = viewportHeight * 0.7; // 70vh
        const hidePoint = viewportHeight * 0.8; // 80vh

        if (rect.top <= revealPoint && rect.bottom >= 0) {
            // Reveal Animation (50vh)
            if (!bugReportInView) {
                bugReportInView = true;
                bugReportOpacity = 1;
                bugReportTranslateY = 0;
            }
        } else if (rect.top >= hidePoint) {
            // Hide Animation (80vh)
            if (bugReportInView) {
                bugReportInView = false;
                bugReportOpacity = 0;
                bugReportTranslateY = 50;
            }
        } else if (rect.top > revealPoint) {
            // Reset wenn über 50vh
            bugReportInView = false;
            bugReportOpacity = 0;
            bugReportTranslateY = 50;
        }
    }

    onMount(() => {
        fetchBugReport().then((res) => {
            mailtoLink = `mailto:${encodeURIComponent(res.data.mailto)}?subject=${encodeURIComponent(res.data.subject)}&body=${encodeURIComponent(res.data.body)}`;
            textUnderButton = res.data.textUnderButton;
            subText = res.data.subText;
            buttonText = res.data.buttonText;
        });
        window.addEventListener("scroll", handleBugReportScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleBugReportScroll);
        };
    });
</script>

<div
    bind:this={bugReportElement}
    class="w-full bg-black/10 transform transition-all duration-700 ease-out"
    style="opacity: {bugReportOpacity}; transform: translateY({bugReportTranslateY}px); background: #0000001a">
    <div class="max-w-[1060px] mx-auto px-4 py-20 text-center">
        <a href={mailtoLink} target="_blank" rel="noopener" class="pt-3">
            <span class="bg-error px-6 py-4 font-bold" style="border-radius: 0.8rem;">{buttonText}</span>
        </a>
        <p class="text-lg mt-12">{textUnderButton}</p>
        <p class="text-lg">{subText}</p>
    </div>
</div>
