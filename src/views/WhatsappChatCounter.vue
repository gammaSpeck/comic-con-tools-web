<script setup lang="ts">
import AnalysisResults from '@/components/whatsapp-analysis/AnalysisResults.vue'
import DateInput from '@/components/whatsapp-analysis/DateInput.vue'
import ResetBtn from '@/components/whatsapp-analysis/ResetBtn.vue'
import { calculateUserChatCounts, validateWhatsappExport, type UserMessageCount } from '@/utils'
import { computed, reactive, ref } from 'vue'

const form = ref<HTMLFormElement | null>(null)
const file = ref<File | null>(null)
const dateFilter = reactive({
  startDate: '',
  endDate: '',
})
const errMsg = ref<string>('')
const userChatCountMap = ref<UserMessageCount | null>(null)

const startDate = computed(() => (dateFilter.startDate ? new Date(dateFilter.startDate) : null))
const endDate = computed(() => (dateFilter.endDate ? new Date(dateFilter.endDate) : null))
const today = computed(() => new Date().toISOString().split('T')[0])

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  file.value = input.files[0]
  const isTextFile = file.value.type === 'text/plain' || file.value.name.endsWith('.txt')
  errMsg.value = isTextFile ? '' : 'Only .txt files are allowed.'

  // Resets past results
  userChatCountMap.value = null
}

function handleSubmit() {
  if (!file.value) return

  const reader = new FileReader()
  reader.onload = (event) => {
    const fileContent = event.target?.result as string
    const { isValid, err } = validateWhatsappExport(fileContent)

    if (!isValid) return (errMsg.value = err)

    userChatCountMap.value = calculateUserChatCounts(fileContent, startDate.value, endDate.value)
  }
  reader.onerror = () => console.error('Error reading the file')
  reader.readAsText(file.value)
}

function reset() {
  file.value = null
  userChatCountMap.value = null
  dateFilter.startDate = ''
  dateFilter.endDate = ''
  form.value?.reset()
}
</script>

<template>
  <div class="bg-gray-100">
    <div class="max-w-lg mx-auto px-4">
      <h2 class="text-2xl font-bold text-left text-green-600 mb-4">Whatsapp Chat Counter</h2>

      <p class="text-left text-gray-700 mb-6">
        This tool will help you track the activity of the users in any WhatsApp group or a DM by
        counting the number of messages sent by each individual in that group.
      </p>

      <form
        ref="form"
        @submit.prevent="handleSubmit"
        class="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4"
      >
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="file-input">
            Upload a WhatsApp chat export (.txt)
          </label>

          <input
            type="file"
            accept=".txt"
            :disabled="!!userChatCountMap"
            @change="handleFileChange"
            class="block w-full text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 cursor-pointer"
            :class="{
              'focus:ring-red-300 border-red-500': !!errMsg,
            }"
          />

          <p v-if="errMsg" class="mt-1 text-red-500 text-sm">{{ errMsg }}</p>
          <p v-else-if="file" class="mt-1 text-xs text-gray-600">Selected File: {{ file.name }}</p>
        </div>

        <div class="flex flex-col">
          <p class="text-sm text-left font-bold text-gray-700">
            Filter by start and end date (optional)
          </p>

          <div class="flex gap-3 justify-between">
            <DateInput
              label="start date"
              id="start-date"
              v-model="dateFilter.startDate"
              :max="dateFilter.endDate || today"
              :disabled="!!userChatCountMap"
            />
            <DateInput
              label="end date"
              id="end-date"
              v-model="dateFilter.endDate"
              :min="dateFilter.startDate || undefined"
              :max="today"
              :disabled="!!userChatCountMap"
            />
          </div>
        </div>

        <div class="flex gap-6">
          <ResetBtn @reset="reset" />

          <button
            type="submit"
            class="bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-300"
            :disabled="!file || !!errMsg"
          >
            Analyze
          </button>
        </div>
      </form>

      <div
        class="mt-4 flex flex-col gap-3 bg-white p-6 rounded-lg shadow-md"
        v-if="file && userChatCountMap"
      >
        <AnalysisResults
          v-if="Object.keys(userChatCountMap).length"
          :fileName="file.name"
          :userCounts="userChatCountMap"
          :startDate="dateFilter.startDate"
          :endDate="dateFilter.endDate"
        />
        <p v-else class="text-gray-700">There were no results found for selected filters.</p>
        <ResetBtn @reset="reset" />
      </div>
    </div>
  </div>
</template>
