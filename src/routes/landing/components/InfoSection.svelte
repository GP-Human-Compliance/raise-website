<script lang="ts">
    import { inview } from "svelte-inview";
    import InfoSectionPhone from "./InfoSectionPhone.svelte";

    // ===== SCHRITT-FÜR-SCHRITT DATEN =====
    // Array mit den 5 Entscheidungsschritten
    // Jeder Schritt hat: Titel, Icon (leer), Beschreibungstext
    let elements = [
        {
            title: "THEMA",
            icon: "",
            text: "Zuerst legst du dein Thema fest. Die AI hilft dir den Kern deiner Frage zu finden.",
        },
        {
            title: "KRITERIEN",
            icon: "",
            text: "Dann definierst du mit AI, was du erreichen willst und setzt einschränkende Faktoren.",
        },
        {
            title: "OPTIONEN",
            icon: "",
            text: "Du gibst jetzt Deine Handlungs-optionen ein oder lässt sie dir von der AI vorschlagen.",
        },
        {
            title: "BEWERTUNG",
            icon: "",
            text: "Nun kannst du bewerten oder von KI bewerten lassen, welche Optionen am Besten passen.",
        },
        {
            title: "ENTSCHEIDEN",
            icon: "",
            text: "Letztlich kommt's auf deinen Bauch an. Du triffst die Entscheidung mittels Widerstandsmessung.",
        },
    ];

    // ===== VIEWPORT TRACKING =====
    // Zustand für Phone-Animation (nur XL+ sichtbar)
    let phoneInView = false;
    // Zustand für Card-Sektion (nur < XL sichtbar)
    let cardSectionInView = false;
</script>

<!-- ===== DESKTOP VERSION (XL+) ===== -->
<!-- Interaktive Phone-Animation mit Rive -->
<div
    class="hidden xl:flex justify-center w-full h-full"
    use:inview={{ unobserveOnEnter: true, threshold: 1 }}
    on:inview_change={(event: any) => (phoneInView = event.detail.inView)}>
    <InfoSectionPhone triggerAnimation={phoneInView}></InfoSectionPhone>
</div>

<!-- ===== MOBILE/TABLET VERSION (< XL) ===== -->
<!-- Statische Card-Liste mit Animationen -->
<div
    use:inview={{ unobserveOnEnter: true, threshold: 0.8 }}
    on:inview_change={(event: any) => (cardSectionInView = event.detail.inView)}
    class="xl:hidden relative overflow-hidden">
    
    <!-- ===== CONTENT WRAPPER ===== -->
    <div class="space-y-4">
        <!-- ===== HEADLINE WRAPPER ===== -->
        <!-- Autark positionierbar -->
        <div class="headline-wrapper">
            <!-- ===== HEADLINE ===== -->
            <!-- Fade-in von unten Animation -->
            <h3
                class="text-2xl text-center
                transform transition duration-600 ease-in-out
                {cardSectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[50%]'}">
                Schritt für Schritt
                <br />
                zur richtigen Entscheidung
            </h3>
        </div>

        <!-- ===== KARTEN WRAPPER ===== -->
        <!-- Autark positionierbar -->
        <div class="cards-wrapper">
            <!-- ===== SCHRITT-KARTEN ===== -->
            <!-- Jede Karte: Slide-in von rechts mit gestaffelten Delays -->
            <div class="space-y-4 mt-16">
                {#each elements as element, i}
                    <div
                        class="flex pl-6 transform transition duration-1200 ease-in-out
                        {cardSectionInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[90%]'}"
                        style={cardSectionInView ? `transition-delay: ${(i + 1) * 200}ms` : ""}>
                        
                        <!-- ===== SCHRITT-NUMMER ===== -->
                        <!-- Links: Nummerierung (1., 2., 3., etc.) -->
                        <div class="w-1/12 text-xl font-bold mt-6">{i + 1}.</div>

                        <!-- ===== SCHRITT-KARTE ===== -->
                        <!-- Rechts: Weiße Karte mit Titel und Beschreibung -->
                        <div class="w-11/12 rounded-l-xl bg-white text-black h-[100px]">
                            <div class="p-3 flex-col justify-center h-full">
                                <h2 class="font-bold text-xl">{element.title}</h2>
                                <p class="text-left text-sm mt-2">{element.text}</p>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
