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

const roles = reactive([])
const loading = ref(true)

onBeforeMount(async () => {
  if (!appStateStore?.hasCtrlAccess) return
  await mqttHook.registerEvent(CONTROL_TOPIC_RESPONSE, processResponse)
  getRoles()
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
    else if (response.command === 'listRoles') {
      loading.value = false
      const responseRoles = response?.data || {}
      for (const responseRole of responseRoles?.roles || []) {
        roles.push(responseRole)
      }
    }
  }
}
function getRoles () {
  const payload = { commands: [] }
  payload.commands.push({
    command: 'listRoles',
    verbose: true,
    count: -1,
    offset: 0
  })
  mqttHook.publish(CONTROL_TOPIC, JSON.stringify(payload))
}
</script>

<template>
  <div v-if="appStateStore?.hasCtrlAccess">
    <div class="card shadow mt-4">
      <div class="card-body">
        <table
          v-if="roles.length"
          class="table table-striped table-hover"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Text name</th>
              <th>Description</th>
              <th class="text-center col-md-1">
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(role, i) of roles"
              :key="i"
            >
              <td class="pointer">
                {{ role.rolename }}
              </td>
              <td class="pointer">
                {{ role?.textname }}
              </td>
              <td class="pointer">
                {{ role?.description }}
              </td>
              <td class="text-center">
                <a class="text-decoration-none mt-0 pointer">
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
        <p v-else>
          No roles
        </p>
      </div>
    </div>
  </div>
  <div
    v-if="appStateStore?.hasCtrlAccess"
    class="row mt-3"
  >
    <div class="col col-lg-12">
      <button
        v-if="appStateStore?.hasCtrlAccess"
        class="btn btn-dark text-warning mt-2"
      >
        <i class="ri-shield-star-line" /> Add role
      </button>
    </div>
  </div>
  <CtrlNoPermissions v-else />
</template>
