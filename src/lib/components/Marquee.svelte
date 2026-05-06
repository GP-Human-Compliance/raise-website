<script lang="ts">
  export let pauseOnHover: boolean = false;
  export let vertical: boolean = false;
  export let repeat: number = 4;
  export let reverse: boolean = false;

  let className: any = "";
  export { className as class };
</script>

<div
  class="group flex overflow-hidden p-2 [--duration:2s] [--gap:1rem] [gap:var(--gap)] {vertical ? 'flex-col' : 'flex-row'} {className}"
>
  {#each { length: repeat } as _, i (i)}
    <div
      class="flex shrink-0 justify-around [gap:var(--gap)] {vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row'} {pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''} {reverse ? 'animate-marquee-reverse' : ''}"
      style="{pauseOnHover ? 'animation-play-state: running;' : ''}"
    >
      <slot>Default</slot>
    </div>
  {/each}
</div>

<style>
  .group:hover .group-hover\:\[animation-play-state\:paused\] {
    animation-play-state: paused !important;
  }
</style>
