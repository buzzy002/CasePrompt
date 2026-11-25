<script setup lang="ts">
import { useId } from 'vue'

// Les attributs (autocomplete, name, minlength...) vont sur l'<input>
defineOptions({ inheritAttrs: false })

interface Props {
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false
})

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const id = useId()
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full font-mono">
    <label v-if="label" :for="id" class="text-xs font-bold text-noir">
      {{ label }}
    </label>
    <input
      :id="id"
      v-bind="$attrs"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="bg-transparent border-b-2 border-noir p-2 text-sm outline-none focus:border-stamp transition-colors disabled:opacity-50"
    />
  </div>
</template>