<script setup lang="ts">
import { format } from 'date-fns'

interface Props {
  userCounts: { [name: string]: number }
  fileName: string
  startDate?: string | null
  endDate?: string | null
}

const props = defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <h2 class="text-xl font-semibold">Chat Activity Results</h2>
    <div class="flex flex-col">
      <p class="text-gray-700">
        These are the results of the chat export:
        <span class="font-bold">
          {{ props.fileName }}
        </span>
      </p>

      <p v-if="startDate || endDate" class="text-gray-700">
        Filtered by
        <template v-if="startDate">
          start date: <span class="font-bold">{{ format(startDate, 'dd/MM/yyyy') }}</span>
        </template>
        {{ startDate && endDate ? ' and ' : '' }}
        <template v-if="endDate">
          end date: <span class="font-bold">{{ format(endDate, 'dd/MM/yyyy') }}</span>
        </template>
      </p>
    </div>

    <div
      class="grid grid-cols-2 gap-x-4 bg-gray-200 text-gray-600 uppercase text-sm leading-normal"
    >
      <div class="py-3 px-6">Name</div>
      <div class="py-3 px-6">Count</div>
    </div>

    <div
      v-for="(count, name) in userCounts"
      :key="name"
      class="grid grid-cols-2 gap-x-4 border-b border-gray-200 hover:bg-gray-100 text-gray-700 text-sm"
    >
      <div class="py-3 px-6 whitespace-nowrap">{{ name }}</div>
      <div class="py-3 px-6">{{ count }}</div>
    </div>
  </div>
</template>
