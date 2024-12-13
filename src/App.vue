<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <main class="bg-gray-100 min-h-screen">
    <header class="bg-gray-200 w-full fixed top-0 z-10">
      <RouterLink to="/">
        <h1 class="text-4xl font-bold text-center text-slate-800 py-4">CC Tools by Madhu</h1>
      </RouterLink>
    </header>

    <div class="py-20 px-4">
      <RouterView />
    </div>
  </main>
</template>
