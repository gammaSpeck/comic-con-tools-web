<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import {
  calculateUserChatCounts,
  generatePDF,
  validateWhatsappExport,
  type UserMessageCount,
} from '@/utils'

import AnalysisResults from '@/components/whatsapp-analysis/AnalysisResults.vue'
import DateInput from '@/components/whatsapp-analysis/DateInput.vue'
import ResetBtn from '@/components/whatsapp-analysis/ResetBtn.vue'

const form = ref<HTMLFormElement | null>(null)
const file = ref<File | null>(null)
const dateFilter = reactive({
  startDate: '',
  endDate: '',
})
const errMsg = ref<string>('')
const customFilterStr = ref<string>('')

const userChatCountMap = ref<UserMessageCount | null>(null)

const resultsRef = ref<HTMLElement | null>(null)
const isGeneratingPDF = ref(false)

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

    userChatCountMap.value = calculateUserChatCounts(
      fileContent,
      startDate.value,
      endDate.value,
      customFilterStr.value,
    )
  }
  reader.onerror = () => console.error('Error reading the file')
  reader.readAsText(file.value)
}

function reset() {
  file.value = null
  userChatCountMap.value = null
  dateFilter.startDate = ''
  dateFilter.endDate = ''
  customFilterStr.value = ''
  form.value?.reset()
}

async function downloadPdf() {
  if (!resultsRef.value || !file.value) return

  isGeneratingPDF.value = true
  try {
    const pdf = await generatePDF(resultsRef.value)
    pdf.save(`${file.value.name}-results.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF. Contact Support.')
  } finally {
    isGeneratingPDF.value = false
  }
}
</script>

<template>
  <div class="bg-gray-100">
    <div class="max-w-xl mx-auto px-0 lg:px-2">
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
            class="block w-full text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 cursor-pointer disabled:cursor-not-allowed"
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

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="filter-input">
            Filter by string (optional)
          </label>

          <input
            id="filter-input"
            placeholder="Type custom filter string..."
            v-model="customFilterStr"
            type="text"
            :disabled="!!userChatCountMap"
            class="block w-full px-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
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

      <div class="mt-4 flex flex-col gap-4" v-if="file && userChatCountMap">
        <div class="bg-white p-6 rounded-lg shadow-md" ref="resultsRef">
          <AnalysisResults
            :fileName="file.name"
            :userCounts="userChatCountMap"
            :startDate="dateFilter.startDate"
            :endDate="dateFilter.endDate"
            :filterByStr="customFilterStr"
          />
        </div>

        <div class="flex gap-6">
          <ResetBtn @reset="reset" :disabled="isGeneratingPDF" />

          <button
            :disabled="isGeneratingPDF"
            class="border border-blue-400 text-blue-400 font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-200 hover:bg-blue-100 cursor-pointer"
            @click="downloadPdf"
          >
            {{ isGeneratingPDF ? 'Generating PDF...' : 'Download PDF' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
