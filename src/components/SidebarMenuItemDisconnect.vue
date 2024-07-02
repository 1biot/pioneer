<script setup>
import { useAppStateStore } from '../stores/appState'
import SidebarMenuItem from './SidebarMenuItem.vue'
import { useRouter } from 'vue-router'
import { useMQTT } from 'mqtt-vue-hook'
import { useTopicCounterStore } from '../stores/topicCounter'
import { useTopicSeriesStore } from '../stores/topicSeries'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const mqttHook = useMQTT()
const appStateStore = useAppStateStore()
const topicCounterStore = useTopicCounterStore()
const topicSeriesStore = useTopicSeriesStore()
const $toast = useToast()

async function disconnect () {
  if (mqttHook.isConnected()) {
    if (confirm('Do you want to disconnect?') === true) {
      await mqttHook.disconnect()
      appStateStore.$reset()
      topicCounterStore.$reset()
      topicSeriesStore.$reset()
      $toast.success('You have been disconnected')
      await router.push('/')
    }
  }
}
</script>

<template>
  <SidebarMenuItem
    :show="appStateStore.isConnected"
    title="Disconnect"
    icon="ri-shut-down-line"
    emit="disconnect"
    @disconnect="disconnect"
  />
</template>
