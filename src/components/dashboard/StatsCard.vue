<script setup>
import { computed } from 'vue'
import { useAppStateStore } from '../../stores/appState'
import { useTopicCounterStore } from '../../stores/topicCounter'
import { dateTimeFormat, elapsedTime } from '../../utils'
import Card from './Card.vue'

const appStateStore = useAppStateStore()
const topicCounterStore = useTopicCounterStore()
const stats = computed(() => {
  const uptimeString = topicCounterStore.getTopicValue('$SYS/broker/uptime', '0 seconds')
  const uptimeInt = parseInt(uptimeString.split(' ')[0])
  return [
    {
      label: 'Host',
      value: appStateStore.host
    },
    {
      label: 'Uptime',
      value: elapsedTime(uptimeInt)
    },
    {
      label: 'Last update',
      value: dateTimeFormat(new Date(topicCounterStore.lastUpdate), 'medium')
    }
  ]
})
</script>

<template>
  <Card
    title="Stats"
    icon="ri-line-chart-fill"
    :list="stats"
  />
</template>
