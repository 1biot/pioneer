<script setup>
import { computed, ref, watch } from 'vue'
import { useTopicCounterStore } from '../stores/topicCounter'

const topicCounterStore = useTopicCounterStore()
const props = defineProps({
  packet: {
    type: Object,
    default: undefined
  }
})
const isActual = ref(false)
const packetLines = computed(() => {
  return [{
    title: 'Topic',
    value: props.packet?.topic
  }, {
    title: 'Messages count',
    value: topicCounterStore.getTopic(props.packet?.topic)?.counter
  }, {
    title: 'QoS',
    value: props.packet?.qos
  }, {
    title: 'Retain',
    value: props.packet?.retain
  }, {
    title: 'Duplicated',
    value: props.packet?.dup
  }, {
    title: 'Message length',
    value: props.packet?.length
  }]
})
const payload = computed(() => {
  try {
    const payloadString = props.packet?.payload?.toString()
    const payloadJson = JSON.parse(payloadString)
    if (typeof payloadJson === 'object') {
      return JSON.stringify(payloadJson, null, 2)
    }

    return payloadJson.toString()
  } catch (e) {
    return props.packet?.payload?.toString()
  }
})
watch(payload, (newPayload, oldPayload) => {
  isActual.value = true
  setTimeout(() => {
    isActual.value = false
  }, 1200)
})
</script>

<template>
  <div
    v-if="packet"
    class="card shadow"
  >
    <div class="card-header text-bg-secondary">
      <div class="row">
        <div class="col-lg-10">
          <h2 class="h4 mb-0 pt-1">
            {{ packet.topic.split('/').pop() }}
          </h2>
        </div>
        <div class="col-lg-1 pt-1">
          <div
            v-if="isActual"
            class="spinner-border spinner-border-sm text-warning"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div class="col-lg-1">
          <a
            class="text-decoration-none text-white float-end pointer"
            @click="topicCounterStore.clearActiveTopic(packet.topic)"
          >
            <i class="ri-close-circle-line fs-5" />
          </a>
        </div>
      </div>
    </div>
    <ul class="list-group list-group-flush">
      <li
        v-for="(packetLine, i) of packetLines"
        :key="i"
        class="list-group-item justify-content-between d-flex align-items-center"
      >
        {{ packetLine.title }}
        <span class="badge border border-secondary text-bg-light rounded-pill px-2 py-1">
          {{ packetLine.value }}
        </span>
      </li>
      <li class="list-group-item justify-content-between align-items-center">
        Payload
        <pre class="bg-body-secondary me-2 mt-2 py-1 px-2 w-100 fw-light">{{ payload }}</pre>
      </li>
    </ul>
  </div>
</template>
