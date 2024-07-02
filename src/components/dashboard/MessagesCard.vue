<script setup>
import { computed } from 'vue'
import { useTopicCounterStore } from '../../stores/topicCounter'
import { toLocaleNumber } from '../../utils'
import Card from './Card.vue'

const topicCounterStore = useTopicCounterStore()
const messages = computed(() => {
  return [
    {
      label: 'Received',
      value: toLocaleNumber(topicCounterStore.getTopicValue('$SYS/broker/messages/received'))
    },
    {
      label: 'Sent',
      value: toLocaleNumber(topicCounterStore.getTopicValue('$SYS/broker/messages/sent'))
    },
    {
      label: 'Stored',
      value: toLocaleNumber(topicCounterStore.getTopicValue('$SYS/broker/messages/stored'))
    }
  ]
})
</script>

<template>
  <Card
    title="Messages"
    icon="ri-question-answer-fill"
    :list="messages"
  />
</template>
