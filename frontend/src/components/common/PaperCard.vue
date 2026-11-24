<script setup lang="ts">
interface Props {
  hasPaperclip?: boolean
}

withDefaults(defineProps<Props>(), {
  hasPaperclip: true
})
</script>

<template>
  <div class="relative w-full bg-[#fbfbf9] border border-[#d9d2c5] shadow-2xl p-8 sm:p-10 font-mono">
    <!-- Trombone rétro optionnel -->
    <div
      v-if="hasPaperclip"
      class="absolute -top-4 left-8 w-4 h-14 border-[2.5px] border-[#757b85] rounded-xl pointer-events-none shadow-sm"
    ></div>
    <slot />
  </div>
</template>