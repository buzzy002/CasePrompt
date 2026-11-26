<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'danger' | 'kraft';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
  type: 'button',
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    @click="$emit('click', $event)"
    class="font-mono text-sm font-bold tracking-wide py-2.5 px-5 cursor-pointer transition-colors duration-150 border-none disabled:opacity-50 disabled:cursor-not-allowed"
    :class="{
      'bg-noir text-cream hover:bg-[#332d27]': variant === 'primary',
      'bg-stamp text-white hover:bg-[#9c2e20]': variant === 'danger',
      'bg-kraft text-noir hover:bg-kraft-dark': variant === 'kraft',
    }"
  >
    <slot />
  </button>
</template>
