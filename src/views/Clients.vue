<script setup>
import { onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMQTT } from 'mqtt-vue-hook'
import { useToast } from 'vue-toast-notification'
import { useAppStateStore } from '../stores/appState'
import { CONTROL_TOPIC, CONTROL_TOPIC_RESPONSE } from '../types'
import CtrlNoPermissions from '../components/CtrlNoPermissions.vue'
import AddClientModal from '../components/AddClientModal.vue'

const router = useRouter()
const mqttHook = useMQTT()
const appStateStore = useAppStateStore()
const $toast = useToast()

const loading = ref(true)
const clients = reactive([])
const client = reactive({
  Modal: {},
  Form: {}
})

onBeforeMount(async () => {
  if (!appStateStore?.hasCtrlAccess) return
  await mqttHook.registerEvent(CONTROL_TOPIC_RESPONSE, processMqttResponse)
  getMqttClients()
})
onMounted(() => {
  if (!appStateStore?.hasCtrlAccess) return
  // eslint-disable-next-line no-undef
  client.Modal = new bootstrap.Modal('#client-modal', {})
})
onUnmounted(async () => {
  if (!appStateStore?.hasCtrlAccess) return
  await mqttHook.unRegisterEvent(CONTROL_TOPIC_RESPONSE)
})

function processMqttResponse (topic, message) {
  const responses = JSON.parse(message.toString())?.responses || []
  if (!responses.length) return
  for (const response of responses) {
    if (response.error) return $toast.error(response.error)
    else if (response.command === 'listClients') {
      loading.value = false
      clients.length = 0
      const responseClients = response?.data || {}
      for (const responseClient of responseClients.clients) {
        clients.push({
          username: responseClient.username,
          clientid: responseClient?.clientid || '',
          textname: responseClient?.textname || '',
          textdescription: responseClient?.textdescription || '',
          groups: responseClient?.groups || [],
          roles: responseClient?.roles || [],
          disabled: responseClient?.disabled || false
        })
      }
    } else if (['enableClient', 'disableClient', 'deleteClient'].includes(response.command)) {
      const toastMessage = `Client has been ${response.command === 'enableClient' ? 'enabled' : response.command === 'deleteClient' ? 'removed' : 'disabled'}`
      $toast.success(toastMessage)
    }
  }
}
function getMqttClients () {
  const payload = { commands: [] }
  payload.commands.push({
    command: 'listClients',
    verbose: true,
    count: -1,
    offset: 0
  })
  mqttHook.publish(CONTROL_TOPIC, JSON.stringify(payload))
}
function toggleMqttActive (username) {
  if (appStateStore.isActualClient(username)) {
    alert('You can not toggle visibility to yourself')
    return
  }

  const client = clients.find(client => client.username === username)
  if (!clients.find(client => client.username === username)) return

  const isDisabled = !(client?.disabled || false)
  const payload = { commands: [] }
  payload.commands.push({
    command: isDisabled ? 'disableClient' : 'enableClient',
    username
  })
  mqttHook.publish(CONTROL_TOPIC, JSON.stringify(payload))
}
function removeMqttClient (username) {
  if (appStateStore.isActualClient(username)) {
    alert('You can not remove yourself')
    return
  }

  if (!confirm(`Do you want to remove client ${username}?`)) {
    return
  }

  const client = clients.find(client => client.username === username)
  if (!client) return $toast.warning('No client to remove')

  const payload = { commands: [] }
  payload.commands.push({
    command: 'deleteClient',
    username
  })
  mqttHook.publish(CONTROL_TOPIC, JSON.stringify(payload))
  getMqttClients()
}
function hideModal () {
  getMqttClients()
  client.Modal.hide()
}
</script>

<template>
  <h1 class="mt-2 mb-3">
    Clients
  </h1>
  <div
    v-if="appStateStore?.hasCtrlAccess"
    class="row"
  >
    <div class="col-12">
      <div class="card shadow">
        <div class="card-body py-3 table-responsive-sm">
          <table
            v-if="clients.length"
            class="table table-striped table-hover"
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Text name</th>
                <th>Description</th>
                <th>Raw groups</th>
                <th>Roles</th>
                <th class="text-center col-md-1">
                  Active
                </th>
                <th class="text-center col-md-1">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="clientItem of clients"
                :key="clientItem.username"
              >
                <td
                  class="pointer"
                  :class="{'text-secondary': clientItem?.disabled}"
                  @click="router.push(`/clients/${clientItem.username}`)"
                >
                  {{ clientItem.username }}
                </td>
                <td
                  class="pointer"
                  :class="{'text-secondary': clientItem?.disabled}"
                  @click="router.push(`/clients/${clientItem.username}`)"
                >
                  {{ clientItem?.clientid ?? '-' }}
                </td>
                <td
                  class="pointer"
                  :class="{'text-secondary': clientItem?.disabled}"
                  @click="router.push(`/clients/${clientItem.username}`)"
                >
                  {{ clientItem?.textname }}
                </td>
                <td
                  class="pointer"
                  :class="{'text-secondary': clientItem?.disabled}"
                  @click="router.push(`/clients/${clientItem.username}`)"
                >
                  {{ clientItem?.textdescription }}
                </td>
                <td><code>{{ clientItem.groups }}</code></td>
                <td>
                  <span
                    v-for="(role, i) of clientItem.roles"
                    :key="i"
                    class="badge rounded-pill bg-info text-dark me-2"
                  >{{ role.rolename }}</span>
                </td>
                <td class="text-center">
                  <div class="form-check form-switch">
                    <label class="form-check-label">
                      <input
                        v-model="clientItem.disabled"
                        :true-value="false"
                        :false-value="!clientItem.disabled"
                        class="form-check-input"
                        :class="appStateStore.isActualClient(clientItem.username) ? 'notAllowed' : 'pointer'"
                        type="checkbox"
                        :disabled="appStateStore.isActualClient(clientItem.username)"
                        @click="toggleMqttActive(clientItem.username)"
                      >
                    </label>
                  </div>
                </td>
                <td class="text-center">
                  <a
                    class="text-decoration-none mt-0"
                    :class="appStateStore.isActualClient(clientItem.username) ? ['text-secondary', 'notAllowed'] : ['text-danger', 'pointer']"
                    @click="removeMqttClient(clientItem.username)"
                  >
                    <i class="ri-delete-bin-7-line" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
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
            No clients
          </p>
        </div>
      </div>
      <button
        v-if="appStateStore?.hasCtrlAccess"
        class="btn btn-primary text-bg-primary mt-3"
        @click="client.Modal.show"
      >
        <i class="ri-user-add-line" /> Add client
      </button>
    </div>
  </div>
  <AddClientModal
    v-if="appStateStore?.hasCtrlAccess"
    ref="clientModal"
    @close-modal="hideModal"
  />
  <CtrlNoPermissions v-else />
</template>

<style scoped>
.form-check-input:disabled {
  pointer-events: visible;
}
</style>
