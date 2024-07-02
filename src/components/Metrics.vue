<script setup>
import { computed } from 'vue'
import { useAppStateStore } from '../stores/appState'
import { useTopicCounterStore } from '../stores/topicCounter'
import { toLocaleNumber } from '../utils'

const appStateStore = useAppStateStore()
const topicCounterStore = useTopicCounterStore()
const cpu = computed(() => {
  return toLocaleNumber(topicCounterStore.getTopicValue('$METRICS/current/cpu'), { maximumFractionDigits: 1 })
})
const memory = computed(() => {
  return toLocaleNumber(topicCounterStore.getTopicValue('$METRICS/current/memory'))
})
const diskUsage = computed(() => {
  return toLocaleNumber(topicCounterStore.getTopicValue('$METRICS/current/disk_usage'))
})

</script>

<template>
  <ul class="navbar-nav me-auto mb-2 mb-lg-0">
    <li
      v-if="appStateStore?.hasMetricsAccess"
      class="nav-item"
      title="CPU"
      aria-label="CPU"
    >
      <a
        role="button"
        class="nav-link disabled"
      >
        <i class="ri-cpu-line" />
        {{ cpu }}%
      </a>
    </li>
    <li
      v-if="appStateStore?.hasMetricsAccess"
      class="nav-item"
      title="Memory usage"
      aria-label="Memory usage"
    >
      <a
        role="button"
        class="nav-link disabled"
      >
        <i class="ri-database-2-line" />
        {{ memory }}%
      </a>
    </li>
    <li
      v-if="appStateStore?.hasMetricsAccess"
      class="nav-item"
      title="Disk usage"
      aria-label="Disk usage"
    >
      <a
        role="button"
        class="nav-link disabled"
      >
        <i class="ri-hard-drive-2-line" />
        {{ diskUsage }}%
      </a>
    </li>
  </ul>
</template>

<style scoped>

</style>
