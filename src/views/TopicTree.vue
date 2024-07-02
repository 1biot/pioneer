<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { useTopicCounterStore } from '../stores/topicCounter'
import TopicTree from '../components/TopicTree.vue'
import PacketModal from '../components/PacketModal.vue'

const topicCounterStore = useTopicCounterStore()
const onCloseModal = event => {
  topicCounterStore.clearActiveTopic()
}
const packet = reactive({
  element: null,
  modal: null,
  payload: computed(() => topicCounterStore.getActiveTopic()?.packet)
})
watch(packet, (newValue) => {
  if (packet.modal === null) return
  if (typeof newValue.payload === 'undefined') {
    packet.modal.hide()
    return
  }

  packet.modal.show()
  packet.modal.handleUpdate()
}, { deep: true })

onMounted(() => {
  packet.element = document.getElementById('packet-modal')
  packet.element.addEventListener('hide.bs.modal', onCloseModal)
  packet.element.addEventListener('hidePrevented.bs.modal', onCloseModal)
  // eslint-disable-next-line no-undef
  packet.modal = new bootstrap.Modal(packet.element)
})

</script>

<template>
  <h1 class="mt-2 mb-3">
    TopicViewer
  </h1>
  <div class="row">
    <div class="col me-auto col-12 col-lg-12">
      <div class="card shadow">
        <div class="card-body">
          <TopicTree class="item" />
        </div>
      </div>
    </div>
  </div>
  <PacketModal
    v-if="packet"
    :packet="packet.payload"
  />
</template>

<style>

</style>
