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
    id="packet-modal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    data-bs-backdrop="static"
  >
    <div
      class="modal-dialog modal-lg modal-fullscreen-md-down modal-dialog-scrollable"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ packet?.topic.split('/').pop() }}
          </h5>
          <button
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="topicCounterStore.clearActiveTopic"
          />
        </div>
        <div class="modal-body p-0">
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
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="topicCounterStore.clearActiveTopic"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
