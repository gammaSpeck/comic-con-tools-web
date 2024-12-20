<script setup lang="ts">
defineProps<{
  modelValue: string | null
  min?: string
  max?: string
  disabled?: boolean
  label: string
  id: string
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emits('update:modelValue', target.value || null)
}
</script>

<template>
  <div class="w-full">
    <label :for="id" class="block text-gray-700 text-xs"> {{ label }}: </label>
    <input
      :id="id"
      type="date"
      :value="modelValue"
      @input="handleInput"
      :min="min"
      :max="max"
      :disabled="disabled"
      class="p-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 cursor-pointer disabled:cursor-not-allowed"
    />
  </div>
</template>
