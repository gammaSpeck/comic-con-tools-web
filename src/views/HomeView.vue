<script setup lang="ts">
import { RouterLink } from 'vue-router'

const tools = [
  {
    id: 1,
    name: 'Whatsapp chat counter',
    description: 'Analyze and track message activity within a WhatsApp chat.',
  },
]
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h2 class="text-2xl text-center text-gray-700 mb-4">Tools</h2>

    <div class="flex items-center justify-center">
      <RouterLink to="/chat-counter">
        <div
          class="bg-white transform transition-transform duration-300 hover:translate-y-[-5px] shadow-md hover:shadow-lg rounded-lg overflow-hidden w-60 cursor-pointer"
        >
          <div class="bg-gray-200 h-50 flex items-center justify-center">
            <img
              src="/WhatsappAnalysis.webp"
              alt="WhatsApp Analysis"
              class="object-cover w-full h-full"
            />
          </div>

          <div class="p-6">
            <h3 class="text-xl font-semibold text-green-600 mb-2">
              {{ tools[0].name }}
            </h3>

            <p class="text-gray-600">
              {{ tools[0].description }}
            </p>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
