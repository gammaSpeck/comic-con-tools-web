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
    <h2 class="text-lg font-semibold">Chat Activity Results</h2>
    <div class="flex flex-col text-gray-700 text-sm">
      <p>
        Exported file name:
        <span class="font-bold">
          {{ props.fileName }}
        </span>
      </p>

      <p v-if="startDate || endDate">
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

    <div class="border-t border-gray-300" />

    <p v-if="!Object.keys(userCounts).length" class="text-gray-500 text-sm">
      🥺 There were no results found for selected filters.
    </p>

    <div v-else>
      <div
        class="grid grid-cols-2 gap-x-4 bg-gray-200 text-gray-600 uppercase text-sm leading-normal"
      >
        <p class="py-3 px-6">Name</p>
        <p class="py-3 px-6">Count</p>
      </div>
      <div
        v-for="(count, name) in userCounts"
        :key="name"
        class="grid grid-cols-2 gap-x-4 border-b border-gray-200 hover:bg-gray-100 text-gray-700 text-sm"
      >
        <p class="py-3 px-6 self-center">{{ name }}</p>
        <p class="py-3 px-6 self-center">{{ count }}</p>
      </div>
    </div>
  </div>
</template>
