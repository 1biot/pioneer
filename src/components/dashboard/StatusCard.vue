<script setup>
import { computed } from 'vue'
import { useAppStateStore } from '../../stores/appState'
import MiniCard from './MiniCard.vue'

const appStateStore = useAppStateStore()
const icon = computed(() => {
  if (appStateStore.isConnected) return 'ri-cast-line'
  else if (appStateStore.isConnecting) return 'ri-repeat-2-line'
  else if (appStateStore.isConnectionFailed) return 'ri-signal-wifi-error-line'
  else if (appStateStore.isDisconnected) return 'ri-signal-wifi-off-line'
  return ''
})
const bgColor = computed(() => {
  if (appStateStore.isConnected) return 'bg-success'
  else if (appStateStore.isConnecting) return 'bg-warning'
  else if (appStateStore.isConnectionFailed) return 'bg-error'
  else if (appStateStore.isDisconnected) return 'bg-warning'
  return ''
})
const textColor = computed(() => {
  if (appStateStore.isConnected) return 'text-white'
  else if (appStateStore.isConnecting) return 'text-secondary'
  else if (appStateStore.isConnectionFailed) return 'text-white'
  else if (appStateStore.isDisconnected) return 'text-secondary'
  return ''
})
</script>

<template>
  <MiniCard
    title="BROKER"
    topic="$SYS/broker/version"
    :bg-color="bgColor"
    :text-color="textColor"
    :icon="icon"
  />
</template>
