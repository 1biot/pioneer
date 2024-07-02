import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { CONNECTION_STATE, CONTROL_TOPIC_RESPONSE } from '../types'

export const useAppStateStore = defineStore('appState', () => {
  const connection = ref(CONNECTION_STATE.NOT_INIT)
  const host = ref('unknown')
  const hasSysAccess = ref(false)
  const hasSysLogAccess = ref(false)
  const hasCtrlAccess = ref(false)
  const hasMetricsAccess = ref(false)
  const client = reactive({
    username: null,
    clientid: null,
    textname: '',
    description: '',
    groups: [],
    roles: [],
    disabled: false
  })

  // const locales = ref('cs-CZ')
  const sidebarOpen = ref(true)
  const locales = ref('en-US')
  const showIncomingTopic = ref(true)

  function setState (state) {
    if (!Object.values(CONNECTION_STATE).includes(state)) return
    connection.value = state
  }

  function setHost (hostName) {
    if (typeof hostName !== 'string') return
    host.value = hostName
  }

  function toggleSidebar () {
    sidebarOpen.value = !sidebarOpen.value
  }

  function setLocales (newLocales) {
    locales.value = newLocales
  }

  function setShowIncomingTopic (value) {
    if (typeof value !== 'boolean') return
    showIncomingTopic.value = value
  }

  function setSysAccess (topic, message) {
    if (topic === '$SYS/broker/version') {
      hasSysAccess.value = true
    }

    return hasSysAccess.value
  }

  function setSysLogAccess (topic, message) {
    if (topic.startsWith('$SYS/broker/log')) {
      hasSysLogAccess.value = true
    }

    return hasSysLogAccess.value
  }

  function setMetricsAccess (topic, message) {
    if (topic.startsWith('$METRICS/current/')) {
      hasMetricsAccess.value = true
    }

    return hasSysAccess.value
  }

  function setCtrlAccess (topic, message) {
    if (topic !== CONTROL_TOPIC_RESPONSE) return false

    const response = JSON.parse(message.toString())
    if (response?.responses[0]?.command !== 'getClient') return false
    const hasAccess = typeof response?.responses[0]?.data?.client === 'object'
    hasCtrlAccess.value = hasAccess
    if (hasAccess) {
      setClient(response?.responses[0]?.data?.client || undefined)
    }
  }

  function setClient (newClient) {
    if (typeof newClient === 'undefined') return
    client.username = newClient.username
    client.clientid = newClient?.clientid || client.clientid
    client.textname = newClient?.textname || ''
    client.description = newClient?.description || ''
    client.groups = newClient?.groups || []
    client.roles = newClient?.roles || []
  }

  function createDefaultClient (username, clientid) {
    setClient({ username, clientid })
  }

  function isActualClient (username) {
    if (typeof username !== 'string' || username === '') return false
    return client.username === username
  }

  const clientName = computed(() => {
    return client.username || client.clientid || 'anonymous'
  })

  const isConnected = computed(() => {
    return connection.value === CONNECTION_STATE.CONNECT
  })

  const isConnecting = computed(() => {
    return connection.value === CONNECTION_STATE.CONNECTING || connection.value === CONNECTION_STATE.RECONNECT
  })

  const isConnectionFailed = computed(() => {
    return connection.value === CONNECTION_STATE.CONNECT_FAILED
  })

  const isDisconnected = computed(() => {
    return connection.value !== CONNECTION_STATE.CONNECT && !isConnecting.value
  })

  function setConnectedState () {
    setState(CONNECTION_STATE.CONNECT)
  }

  function setReconnectState (topic, message) {
    setState(CONNECTION_STATE.RECONNECT)
  }

  function setDisconnectState (topic, message) {
    setState(CONNECTION_STATE.DISCONNECT)
  }

  function setConnectionFailedState () {
    setState(CONNECTION_STATE.CONNECT_FAILED)
  }

  function setConnectingState () {
    setState(CONNECTION_STATE.CONNECTING)
  }

  function $reset () {
    connection.value = CONNECTION_STATE.DISCONNECT
    host.value = 'unknown'
    hasCtrlAccess.value = false
    hasSysAccess.value = false
    hasSysLogAccess.value = false
    hasMetricsAccess.value = false
    client.username = null
    client.clientid = null
    client.textname = ''
    client.description = ''
    client.groups = []
    client.roles = []
    client.disabled = false
  }

  return {
    host,
    hasCtrlAccess,
    hasMetricsAccess,
    hasSysAccess,
    hasSysLogAccess,
    sidebarOpen,
    locales,
    showIncomingTopic,
    $reset,
    setHost,
    toggleSidebar,
    setLocales,
    setShowIncomingTopic,
    createDefaultClient,
    setCtrlAccess,
    setSysAccess,
    setSysLogAccess,
    setMetricsAccess,
    setConnectingState,
    setConnectedState,
    setReconnectState,
    setDisconnectState,
    setConnectionFailedState,
    isActualClient,
    clientName,
    isConnected,
    isConnecting,
    isConnectionFailed,
    isDisconnected
  }
})
