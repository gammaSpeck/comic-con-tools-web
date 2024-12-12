<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <main class="bg-gray-100 min-h-screen py-8">
    <RouterLink to="/">
      <h1 class="text-4xl font-bold text-center text-blue-600 mb-12">CC Tools by Madhu</h1>
    </RouterLink>

    <RouterView />
  </main>
</template>
