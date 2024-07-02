<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMQTT } from 'mqtt-vue-hook'
import { useAppStateStore } from '../stores/appState'
import { useTopicCounterStore } from '../stores/topicCounter'
import { useTopicSeriesStore } from '../stores/topicSeries'
import { useToast } from 'vue-toast-notification'
import { CONTROL_TOPIC, CONTROL_TOPIC_RESPONSE } from '../types'

const router = useRouter()
const mqttHook = useMQTT()
const appState = useAppStateStore()
const topicCounterStore = useTopicCounterStore()
const topicSeriesStore = useTopicSeriesStore()
const $toast = useToast()

const buttonText = computed(() => {
  if (appState.isConnected) return 'Connected'
  else if (appState.isConnecting) return 'Connecting...'
  return 'Connect'
})
const isFormDisabled = computed(() => {
  return appState.isConnecting
})
const connectionOptions = reactive({
  protocol: 'wss',
  username: '',
  password: '',
  host: 'test.mosquitto.org',
  port: 8081,
  path: '/mqtt',
  clean: true,
  clientId: '1biot_pioneer'
})
const SUBSCRIBE_LIST = ['$SYS/#', '$CONTROL/#', '$METRICS/#']
const form = {
  protocol: [
    {
      text: 'ws://',
      value: 'ws'
    },
    {
      text: 'wss://',
      value: 'wss'
    }
  ]
}

async function connect () {
  appState.setConnectingState()
  const { protocol, host, port, path, ...options } = connectionOptions
  const connectUrl = `${protocol}://${host}:${port}${path}`

  let cancelTimeout
  try {
    await registerEvents()
    const subscribeOptions = subscribeConfig(1)
    await mqttHook.subscribe(SUBSCRIBE_LIST, subscribeOptions.qos, subscribeOptions)

    // We'll wait for response for 12s and then cancel connection.
    // Why 12s? It is log enough for connection issues with timeout and speed and then you can try again
    cancelTimeout = setTimeout(cancelConnecting, 12000)
    await mqttHook.connect(connectUrl, options)
  } catch (e) {
    appState.setConnectionFailedState()
    await unregisterEventsOnError()
    if (cancelTimeout) clearTimeout(cancelTimeout)
    $toast.error(e?.message || 'Unknown error', { duration: 6000 })
    await mqttHook.disconnect()
  }
}
async function onConnect (topic, message) {
  const { username, host, clientId } = connectionOptions
  appState.setConnectedState()
  appState.setHost(host)
  appState.createDefaultClient(username, clientId)
  await getClientInfo(username)

  // We'll wait for response for 12s and then unregister event.
  // Why 12s? It is log enough for connection issues with timeout and speed
  setTimeout(unregisterTemporaryEvents, 12000)

  $toast.success('You have been connected')
  await router.push('/dashboard')
}
async function registerEvents () {
  await registerSystemEvents()
  await registerTemporaryEvents()

  // TOPIC TREE
  await mqttHook.registerEvent('#', topicCounterStore.pushToBucket)

  // BASE CHART SERIES DATA AND LOG
  const seriesTopics = ['$SYS/broker/heap/current', '$SYS/broker/clients/connected', '$SYS/broker/log/#'/*, '$METRICS/current/+' */]
  for (const topic of seriesTopics) {
    await mqttHook.registerEvent(topic, topicSeriesStore.pushToBucket)
  }
}
async function registerSystemEvents () {
  // system events
  await mqttHook.registerEvent('on-reconnect', appState.setReconnectState)
  await mqttHook.registerEvent('on-disconnect', appState.setDisconnectState)
  await mqttHook.registerEvent('on-connect', onConnect)
  await mqttHook.registerEvent('on-connect-fail', onConnectFail)
}
async function registerTemporaryEvents () {
  // CHECK ACCESS
  await mqttHook.registerEvent(CONTROL_TOPIC_RESPONSE, appState.setCtrlAccess)
  await mqttHook.registerEvent('$METRICS/current/+', appState.setMetricsAccess)
  await mqttHook.registerEvent('$SYS/broker/version', appState.setSysAccess)
  await mqttHook.registerEvent('$SYS/broker/log/+', appState.setSysLogAccess)
}
async function unregisterTemporaryEvents () {
  await mqttHook.unRegisterEvent(CONTROL_TOPIC_RESPONSE)
  await mqttHook.unRegisterEvent('$METRICS/current/+')
  await mqttHook.unRegisterEvent('$SYS/broker/version')
  await mqttHook.unRegisterEvent('$SYS/broker/log/+')
}
async function unregisterEventsOnError () {
  await mqttHook.clearEvent()
}
async function onConnectFail (topic, message) {
  appState.setConnectionFailedState()
  await unregisterEventsOnError()
  if (typeof message !== 'string') { return $toast.error('Connection failed: Unknown error') } else if (message.includes('Error:')) { return $toast.error(message.split(':').slice(1).map(item => item.trim()).join(': ')) }

  return $toast.error('Connection failed: Unknown error')
}
async function cancelConnecting () {
  if (appState.isConnecting) {
    appState.setConnectionFailedState()
    await unregisterEventsOnError()
    await mqttHook.disconnect()
    $toast.error('Connection failed')
    const { protocol } = connectionOptions
    if (protocol === 'wss') {
      $toast.warning('Maybe you try to connect broker with expired certificate.', { duration: 5000 })
    }
  }
}
async function getClientInfo (username) {
  const payload = {
    commands: [{
      command: 'getClient',
      username
    }]
  }

  await mqttHook.publish(CONTROL_TOPIC, JSON.stringify(payload))
}
function subscribeConfig (qos = 1, nl = false, rap = false, rh = 0, props = {}) {
  return {
    qos,
    nl,
    rap,
    rh,
    properties: props
  }
}
</script>

<template>
  <div class="row mt-4 mb-3">
    <div
      class="col me-auto col-12 col-lg-12"
    >
      <div class="card shadow">
        <div class="card-header text-bg-light">
          <h1 class="h4 mb-0 pt-1">
            Connect
          </h1>
        </div>
        <div class="card-body">
          <form @submit.prevent="connect">
            <div class="row">
              <div class="col-md-2">
                <label class="form-label">Protocol</label>
                <select
                  id="protocol"
                  v-model="connectionOptions.protocol"
                  class="form-select"
                  :disabled="isFormDisabled"
                >
                  <option
                    v-for="(option, i) in form.protocol"
                    :key="i"
                    :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label
                  class="form-label"
                  for="host"
                >Host</label>
                <input
                  id="host"
                  v-model="connectionOptions.host"
                  class="form-control"
                  type="text"
                  autocomplete="on"
                  :disabled="isFormDisabled"
                >
              </div>
              <div class="col-md-2">
                <label
                  class="form-label"
                  for="port"
                >Port</label>
                <input
                  id="port"
                  v-model="connectionOptions.port"
                  class="form-control"
                  type="number"
                  autocomplete="on"
                  :disabled="isFormDisabled"
                >
              </div>
              <div class="col-md-2">
                <label
                  class="form-label"
                  for="basepath"
                >Basepath</label>
                <input
                  id="basepath"
                  v-model="connectionOptions.path"
                  class="form-control"
                  type="text"
                  autocomplete="on"
                  :disabled="isFormDisabled"
                >
              </div>
              <div class="col-md-4">
                <label
                  class="form-label"
                  for="username"
                >Username</label>
                <input
                  id="username"
                  v-model="connectionOptions.username"
                  class="form-control"
                  type="text"
                  autocomplete="on"
                  :disabled="isFormDisabled"
                >
              </div>
              <div class="col-md-4">
                <label
                  class="form-label"
                  for="password"
                >Password</label>
                <input
                  id="password"
                  v-model="connectionOptions.password"
                  class="form-control"
                  placeholder="password"
                  type="password"
                  autocomplete="on"
                  :disabled="isFormDisabled"
                >
              </div>
              <div class="col-md-4">
                <label
                  class="form-label"
                  for="password"
                >Client ID</label>
                <input
                  id="clientId"
                  v-model="connectionOptions.clientId"
                  class="form-control"
                  placeholder="client ID"
                  type="text"
                  :disabled="isFormDisabled"
                >
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-md-4">
                <div class="form-check form-switch">
                  <label class="form-check-label">
                    <input
                      v-model="connectionOptions.clean"
                      :disabled="isFormDisabled"
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                    >
                    Clean session
                  </label>
                </div>
              </div>
              <div class="col-md-8">
                <button
                  :disabled="isFormDisabled"
                  class="btn btn-primary float-end"
                  type="submit"
                >
                  {{ buttonText }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid" />
</template>

<style scoped>
label.form-label {
    margin-top: 0.5rem;
}
</style>
