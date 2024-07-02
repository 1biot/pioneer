<script setup>
import { computed } from 'vue'
import { useTopicCounterStore } from '../../stores/topicCounter'
import { toLocaleNumber } from '../../utils'
import Card from './Card.vue'

const topicCounterStore = useTopicCounterStore()
const clients = computed(() => {
  return [
    {
      label: 'Connected',
      value: toLocaleNumber(topicCounterStore.getTopicValue('$SYS/broker/clients/connected'))
    },
    {
      label: 'Total',
      value: toLocaleNumber(topicCounterStore.getTopicValue('$SYS/broker/clients/total'))
    },
    {
      label: 'Subscriptions',
      value: toLocaleNumber(topicCounterStore.getTopicValue('$SYS/broker/subscriptions/count'))
    }
  ]
})
</script>

<template>
  <Card
    title="Clients"
    icon="ri-group-2-fill"
    :list="clients"
  />
</template>
