<script setup lang="ts">
const emit = defineEmits<{
  reset: []
}>()
</script>

<template>
  <button
    class="border border-red-400 text-red-400 font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-red-200 hover:bg-red-100 cursor-pointer"
    @click="emit('reset')"
  >
    Reset
  </button>
</template>
