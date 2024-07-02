<script setup>
import { CONTROL_TOPIC } from '../types'
import { useTopicCounterStore } from '../stores/topicCounter'

const topicCounterStore = useTopicCounterStore()
</script>

<template>
  <div class="container mt-5">
    <p class="text-center text-secondary fst-italic">
      It's seem that you have no permissions to the topic <code>{{ CONTROL_TOPIC }}/#</code>.
    </p>
    <p class="text-center text-secondary fst-italic">
      Maybe you don't have a properly configured
      <a
        href="https://mosquitto.org/documentation/dynamic-security/"
        target="_blank"
      >
        Dynamic Security Plugin
        <i class="ri-external-link-fill" />
      </a>.
      It is supported since Mosquitto 2.0
    </p>
    <p class="text-center text-secondary fst-italic">
      Your broker version is <code>{{ topicCounterStore.getTopic('$SYS/broker/version')?.packet?.payload || 'Unknown' }}</code>
    </p>
  </div>
</template>
