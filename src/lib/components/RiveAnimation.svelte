<script lang="ts">
  import { onMount } from "svelte";
  import { Rive, Fit, Alignment, Layout } from "@rive-app/canvas";

  let canvas: HTMLCanvasElement;

  const RIVE_SRC = "/images/rive/Phone_Screen_animation.riv";
  const STATE_MACHINE = "State Machine 1";
  const INPUT_NAME = "Number_1";
  const STEPS = [0, 100, 200, 300, 400, 500];

  let rive: Rive;
  let inputNumber: any;
  let currentStep = 0;
  let isLoaded = false;
  let loadError = false;
  let revealTriggered = false;
  
  // Exportiere Funktionen für externe Nutzung
  
  export function goToStep(step: number) {
    setStep(step);
  }

  onMount(() => {
    
    
    rive = new Rive({
      src: RIVE_SRC,
      canvas,
      autoplay: true,
      stateMachines: STATE_MACHINE,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      onLoad: async () => {
        
        isLoaded = true;
        rive.resizeDrawingSurfaceToCanvas();
        
        try {
          const inputs = rive.stateMachineInputs(STATE_MACHINE);
          
          
          inputNumber = inputs.find((i) => i.name === INPUT_NAME);
          if (!inputNumber) {
            return;
          }
          
          // Reveal-Animation wird erst getriggert wenn InfoSteps bei 50vh ist
          
        } catch (error) {
          
        }
      },
      onLoadError: (error) => {
        loadError = true;
      }
    });

    window.addEventListener("resize", () => rive?.resizeDrawingSurfaceToCanvas());
  });

  async function playInitialAnimation() {
    inputNumber.value = 0;
    await wait(500); // Kurze Pause bei 0
    inputNumber.value = 100;
    currentStep = 1; // Startet bei Schritt 1 nach Reveal
    revealTriggered = true;
  }

  // Exportiere Funktion für externe Trigger
  export function triggerReveal() {
    if (!revealTriggered && isLoaded && inputNumber) {
      playInitialAnimation();
    }
  }

  // Exportiere Funktion für Reset
  export function resetReveal() {
    if (revealTriggered && isLoaded && inputNumber) {
      inputNumber.value = 0;
      currentStep = 0;
      revealTriggered = false;
    }
  }

  function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function setStep(nextStep: number) {
    
    if (!inputNumber) {
      return;
    }
    
    // Verhindere Navigation zu Schritt 0 - Minimum ist Schritt 1
    nextStep = clamp(nextStep, 1, STEPS.length - 1);
    const target = STEPS[nextStep];
    const goingBack = nextStep < currentStep;
    
    
    // Rückwärts-Animation: Verwende spezielle Werte für Rückwärts-Animation
    let valueToSet;
    if (goingBack) {
      // Rückwärts-Werte: 99, 199, 299, 399, 499
      // Rückwärts-Werte: 199, 299, 399, 499
      if (target === 100) {
        valueToSet = 199; // Schritt 1 → 199
      } else if (target === 200) {
        valueToSet = 299; // Schritt 2 → 299
      } else if (target === 300) {
        valueToSet = 399; // Schritt 3 → 399
      } else if (target === 400) {
        valueToSet = 499; // Schritt 4 → 499
      } else {
        valueToSet = target - 1; // Fallback
      }
    } else {
      // Vorwärts-Werte: 100, 200, 300, 400, 500
      valueToSet = target;
    }
    
    // Spezialfall: Wenn von Schritt 0 zu Schritt 1 (erster Klick)
    if (currentStep === 0 && nextStep === 1) {
      valueToSet = 100; // Direkt zu 100, nicht 99
    }
    
    
    inputNumber.value = valueToSet;
    currentStep = nextStep;
    
  }

  function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
  }

</script>

<div class="rive-container">
  <canvas bind:this={canvas} width="358" height="776"></canvas>
  
  {#if loadError}
    <div class="error-message">
      <p>❌ Rive-Animation konnte nicht geladen werden</p>
      <p>Pfad: {RIVE_SRC}</p>
    </div>
  {:else if !isLoaded}
    <div class="loading-message">
      <p>🔄 Lade Rive-Animation...</p>
    </div>
  {/if}

</div>

<style>
  .rive-container {
    position: relative;
    width: 358px;
    height: 776px;
  }

  canvas {
    width: 358px;
    height: 776px;
    border-radius: 50px;
    background: linear-gradient(135deg, #2c3d47, #874e43);
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
  }


  .error-message, .loading-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    z-index: 10;
  }

  .error-message p, .loading-message p {
    margin: 5px 0;
    font-size: 14px;
  }
</style>
