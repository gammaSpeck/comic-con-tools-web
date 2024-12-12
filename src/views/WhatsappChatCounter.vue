<script setup lang="ts">
import { calculateUserChatCounts, validateWhatsappExport, type UserMessageCount } from '@/utils'
import { ref } from 'vue'

const file = ref<File | null>(null)
const errMsg = ref<string>('')
const userChatCountMap = ref<UserMessageCount | null>(null)

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  file.value = input.files[0]
  const isTextFile = file.value.type === 'text/plain' || file.value.name.endsWith('.txt')
  errMsg.value = isTextFile ? '' : 'Only .txt files are allowed.'
}

function handleSubmit() {
  if (!file.value) return

  const reader = new FileReader()
  reader.onload = (event) => {
    const fileContent = event.target?.result as string
    const { isValid, err } = validateWhatsappExport(fileContent)

    if (!isValid) return (errMsg.value = err)

    userChatCountMap.value = calculateUserChatCounts(fileContent)
  }
  reader.onerror = () => console.error('Error reading the file')
  reader.readAsText(file.value)
}

function reset() {
  file.value = null
  userChatCountMap.value = null
}
</script>

<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="max-w-lg mx-auto px-4">
      <h2 class="text-2xl font-bold text-left text-green-600 mb-4">Whatsapp Chat Counter</h2>

      <p class="text-md text-left text-gray-700 mb-6">
        This tool will help you track the activity of the users in any WhatsApp group or a DM by
        counting the number of messages sent by each individual in that group.
      </p>

      <form
        @submit.prevent="handleSubmit"
        class="bg-white p-6 rounded-lg shadow-md flex flex-col gap-3"
      >
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="file-input">
            Upload a WhatsApp chat export (.txt):
          </label>

          <input
            type="file"
            accept=".txt"
            @change="handleFileChange"
            class="block w-full text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 cursor-pointer"
            :class="{
              'focus:ring-red-300 border-red-500': !!errMsg,
            }"
          />

          <p v-if="errMsg" class="mt-1 text-red-500 text-sm">{{ errMsg }}</p>
          <p v-else-if="file" class="mt-1 text-sm text-gray-600">Selected File: {{ file.name }}</p>
        </div>

        <button
          type="submit"
          class="bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-700 cursor-pointer"
          :disabled="!file"
        >
          Upload and Analyze
        </button>
      </form>

      <div
        v-if="userChatCountMap && Object.keys(userChatCountMap).length > 0"
        class="mt-8 flex flex-col gap-3"
      >
        <h2 class="text-xl font-semibold">Chat Activity Results</h2>
        <div
          class="grid grid-cols-2 gap-x-4 bg-gray-200 text-gray-600 uppercase text-sm leading-normal"
        >
          <div class="py-3 px-6">Name</div>
          <div class="py-3 px-6">Count</div>
        </div>

        <div
          v-for="(count, name) in userChatCountMap"
          :key="name"
          class="grid grid-cols-2 gap-x-4 border-b border-gray-200 hover:bg-gray-100 text-gray-700 text-sm"
        >
          <div class="py-3 px-6 whitespace-nowrap">{{ name }}</div>
          <div class="py-3 px-6">{{ count }}</div>
        </div>

        <button
          class="bg-red-400 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-200 hover:bg-red-500"
          @click="reset"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>
