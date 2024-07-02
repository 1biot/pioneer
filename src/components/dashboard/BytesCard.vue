<script setup>
import { computed } from 'vue'
import { useTopicCounterStore } from '../../stores/topicCounter'
import { formatBytes } from '../../utils'
import Card from './Card.vue'

const topicCounterStore = useTopicCounterStore()

const bytes = computed(() => {
  return [
    {
      label: 'Received',
      value: formatBytes(topicCounterStore.getTopicValue('$SYS/broker/bytes/received'))
    },
    {
      label: 'Sent',
      value: formatBytes(topicCounterStore.getTopicValue('$SYS/broker/bytes/sent'))
    },
    {
      label: 'Stored',
      value: formatBytes(topicCounterStore.getTopicValue('$SYS/broker/store/messages/bytes'))
    }
  ]
})

</script>

<template>
  <Card
    title="Bytes"
    icon="ri-database-2-fill"
    :list="bytes"
  />
</template>
