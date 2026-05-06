<script lang="ts">
  export let name: string;
  export let username: string;
  export let body: string;
  export let img: string;
</script>

<div class="w-[350px] rounded-xl border bg-card p-4 shadow-lg">
  <div class="flex items-center gap-3">
    <img
      src={img}
      alt={name}
      class="h-10 w-10 rounded-full object-cover"
    />
    <div>
      <h3 class="font-semibold">{name}</h3>
      <p class="text-sm text-muted-foreground">{username}</p>
    </div>
  </div>
  <p class="mt-3 text-sm">{body}</p>
</div>
