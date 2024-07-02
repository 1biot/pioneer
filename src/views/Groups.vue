<script setup>
import { onBeforeMount, onUnmounted, reactive, ref } from 'vue'
import { useMQTT } from 'mqtt-vue-hook'
import { useToast } from 'vue-toast-notification'
import { useAppStateStore } from '../stores/appState'
import { CONTROL_TOPIC, CONTROL_TOPIC_RESPONSE } from '../types'
import CtrlNoPermissions from '../components/CtrlNoPermissions.vue'

const mqttHook = useMQTT()
const $toast = useToast()
const appStateStore = useAppStateStore()

const groups = reactive([])
const loading = ref(true)

onBeforeMount(async () => {
  if (!appStateStore?.hasCtrlAccess) return
  await mqttHook.registerEvent(CONTROL_TOPIC_RESPONSE, processResponse)
  getGroups()
})
onUnmounted(async () => {
  if (!appStateStore?.hasCtrlAccess) return
  await mqttHook.unRegisterEvent(CONTROL_TOPIC_RESPONSE)
})

function processResponse (topic, message) {
  const responses = JSON.parse(message.toString())?.responses || []
  if (!responses) return

  for (const response of responses) {
    if (response.error) return $toast.error(response.error)
    else if (response.command === 'listGroups') {
      loading.value = false
      const responseRoles = response?.data || {}
      for (const responseRole of responseRoles?.groups || []) {
        groups.push(responseRole)
      }
    }
  }
}
function getGroups () {
  const payload = { commands: [] }
  payload.commands.push({
    command: 'listGroups',
    verbose: true,
    count: -1,
    offset: 0
  })
  mqttHook.publish(CONTROL_TOPIC, JSON.stringify(payload))
}
</script>

<template>
  <div
    v-if="appStateStore?.hasCtrlAccess"
    class="row my-4"
  >
    <div class="col col-lg-12">
      <button
        v-if="appStateStore?.hasCtrlAccess"
        class="btn btn-dark text-warning float-end mt-2"
      >
        <i class="ri-shield-star-line" /> Add group
      </button>
    </div>
  </div>
  <div v-if="appStateStore?.hasCtrlAccess">
    <pre v-if="groups.length">{{ groups }}</pre>
    <p
      v-else-if="loading"
      class="text-center text-secondary fst-italic"
    >
      Loading...
    </p>
    <p
      v-else
      class="text-center text-secondary fst-italic"
    >
      No groups
    </p>
  </div>
  <CtrlNoPermissions v-else />
</template>
