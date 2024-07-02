<script setup>
import { onBeforeMount, onUpdated, reactive, ref } from 'vue'
import { useMQTT } from 'mqtt-vue-hook'
import { useAppStateStore } from '../stores/appState'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { CONTROL_TOPIC, CONTROL_TOPIC_RESPONSE } from '../types'
import CtrlNoPermissions from '../components/CtrlNoPermissions.vue'

const route = useRoute()
const router = useRouter()
const mqttHook = useMQTT()
const appStateStore = useAppStateStore()
const $toast = useToast()

const loading = ref(true)
const groups = reactive([])
const roles = reactive([])
const clientData = reactive({
  username: '',
  password: '',
  clientid: '',
  textname: '',
  textdescription: '',
  groups: [],
  roles: []
})
const clientFormData = reactive({
  username: '',
  password: '',
  clientid: '',
  textname: '',
  textdescription: '',
  groups: [],
  roles: []
})
const clientName = ref()
const tooltips = ref([])

onBeforeMount(async () => {
  if (!appStateStore?.hasCtrlAccess) return
  await mqttHook.registerEvent(CONTROL_TOPIC_RESPONSE, processMqttResponse)
  getMqttClientDetail(route.params?.username)
  getMqttGroupsAndRoles()
})
onUpdated(() => {
  if (!loading.value && !tooltips.value.length) {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    // eslint-disable-next-line no-undef
    tooltips.value = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  }
})
function processMqttResponse (topic, message) {
  const responses = JSON.parse(message.toString())?.responses || []
  if (!responses.length) return
  for (const response of responses) {
    if (response.error) return $toast.error(response.error) && console.log(response)
    else if (response.command === 'getClient') {
      loading.value = false
      const responseClient = response?.data?.client || undefined
      if (typeof responseClient === 'undefined') {
        $toast.error('Client does not exists')
        return
      }
      setClientData(responseClient)
      clientName.value = clientData.username
    } else if (response.command === 'listGroups') {
      const responseGroups = response?.data || {}
      for (const responseGroup of responseGroups?.groups || []) {
        if (!groups.includes(responseGroup)) groups.push(responseGroup)
      }
    } else if (response.command === 'listRoles') {
      const responseRoles = response?.data || {}
      for (const responseRole of responseRoles?.roles || []) {
        if (!roles.includes(responseRole)) roles.push(responseRole)
      }
    } else if (response.command === 'modifyClient') {
      $toast.success('User has been updated')
    }
  }
}
function getMqttClientDetail (username) {
  const payload = { commands: [] }
  payload.commands.push({
    command: 'getClient',
    username
  })
  mqttHook.publish(CONTROL_TOPIC, JSON.stringify(payload))
}
function getMqttGroupsAndRoles () {
  const payload = { commands: [] }
  payload.commands.push({
    command: 'listGroups'
  })
  payload.commands.push({
    command: 'listRoles'
  })

  mqttHook.publish(CONTROL_TOPIC, JSON.stringify(payload))
}
function updateClient () {
  const updateData = { ...clientFormData }
  updateData.groups = updateData.groups.map(groupItem => ({ groupname: groupItem }))
  updateData.roles = updateData.roles.map(roleItem => ({ rolename: roleItem }))

  if (!updateData.password?.length) {
    delete updateData.password
  }

  const payload = { commands: [] }
  let clientPayload = { command: 'modifyClient' }
  clientPayload = { ...clientPayload, ...updateData }
  payload.commands.push(clientPayload)
  mqttHook.publish(CONTROL_TOPIC, JSON.stringify(payload))
  getMqttClientDetail(route.params?.username)
}
function setClientData (newClientData) {
  clientData.username = newClientData.username
  clientData.password = newClientData?.password
  clientData.clientid = newClientData?.clientid
  clientData.textname = newClientData?.textname
  clientData.textdescription = newClientData?.textdescription
  clientData.groups = newClientData?.groups || []
  clientData.roles = newClientData?.roles || []
  setFormData(clientData)
}
function setFormData (newClientData) {
  clientFormData.username = newClientData.username
  clientFormData.password = newClientData.password
  clientFormData.clientid = newClientData.clientid
  clientFormData.textname = newClientData.textname
  clientFormData.textdescription = newClientData.textdescription
  clientFormData.groups = newClientData.groups.map(groupItem => groupItem.groupname)
  clientFormData.roles = newClientData.roles.map(roleItem => roleItem.rolename)
}
</script>

<template>
  <div
    v-if="appStateStore?.hasCtrlAccess"
    class="mt-4"
  >
    <p
      v-if="loading"
      class="text-center text-secondary fst-italic"
    >
      Loading...
    </p>
    <form
      v-else
      class="card shadow"
      @submit.prevent="updateClient"
    >
      <h1 class="h3 card-header">
        Client <small class="text-secondary">{{ clientName }}</small>
      </h1>
      <div
        class="card-body py-3"
      >
        <ul
          id="clientDetailTab"
          class="nav nav-tabs mb-4"
          role="tablist"
        >
          <li
            class="nav-item"
            role="presentation"
          >
            <button
              id="general-tab"
              class="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#general"
              type="button"
              role="tab"
              aria-controls="general"
              aria-selected="true"
            >
              General
            </button>
          </li>
          <li
            class="nav-item"
            role="presentation"
          >
            <button
              id="groups-tab"
              class="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#groups"
              type="button"
              role="tab"
              aria-controls="groups"
              aria-selected="false"
            >
              Groups
            </button>
          </li>
          <li
            class="nav-item"
            role="presentation"
          >
            <button
              id="roles-tab"
              class="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#roles"
              type="button"
              role="tab"
              aria-controls="roles"
              aria-selected="false"
            >
              Roles
            </button>
          </li>
        </ul>
        <div
          id="clientDetailTabContent"
          class="tab-content px-2"
        >
          <div
            id="general"
            class="tab-pane show active"
            role="tabpanel"
            aria-labelledby="general-tab"
          >
            <div class="row g-3 align-items-center mb-2">
              <label class="col-lg-1 col-sm-6 col-form-label fw-bold">Username:</label>
              <div class="col-lg-2 col-sm-6">
                <input
                  v-model="clientFormData.username"
                  type="text"
                  class="form-control"
                  readonly
                  disabled
                >
              </div>
            </div>
            <div class="row g-3 align-items-center mb-2">
              <label class="col-lg-1 col-sm-6 col-form-label fw-bold">Password:</label>
              <div class="col-lg-2 col-sm-6">
                <input
                  v-model="clientFormData.password"
                  type="password"
                  class="form-control"
                >
              </div>
            </div>
            <div class="row g-3 align-items-center mb-2">
              <label class="col-1 col-form-label fw-bold">Client ID:</label>
              <div class="col-auto">
                <input
                  v-model="clientFormData.clientid"
                  type="text"
                  class="form-control"
                >
              </div>
              <div class="col-auto">
                <i
                  class="ri-question-line fs-4 text-secondary help-pointer"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  data-bs-title="When client ID is empty, settings belong to user with any client ID, when client ID is not empty, settings belong to concrete user with client ID"
                />
              </div>
            </div>
            <div class="row g-3 align-items-center mb-2">
              <label class="col-lg-1 col-sm-6 col-form-label fw-bold">Name:</label>
              <div class="col-lg-2 col-sm-6">
                <input
                  v-model="clientFormData.textname"
                  type="text"
                  class="form-control"
                >
              </div>
            </div>
            <div class="row g-3 align-items-center mb-2">
              <label class="col-lg-1 col-sm-6 col-form-label fw-bold">Description:</label>
              <div class="col-lg-3 col-sm-6">
                <textarea
                  v-model="clientFormData.textdescription"
                  class="form-control"
                />
              </div>
            </div>
          </div>
          <div
            id="groups"
            class="tab-pane px-2"
            role="tabpanel"
            aria-labelledby="groups-tab"
          >
            <div class="mb-1">
              <select
                v-if="groups.length"
                v-model="clientFormData.groups"
                class="form-select"
                multiple
                aria-label="multiple select groups"
              >
                <option
                  v-for="(group, i) of groups"
                  :key="i"
                >
                  {{ group }}
                </option>
              </select>
              <p
                v-else
                class="text-center text-secondary fst-italic"
              >
                No groups defined. You need
                <a
                  class="pointer"
                  @click="router.push('/groups')"
                >
                  define
                </a> any.
              </p>
            </div>
          </div>
          <div
            id="roles"
            class="tab-pane px-2"
            role="tabpanel"
            aria-labelledby="roles-tab"
          >
            <div class="mb-1">
              <select
                v-if="roles.length"
                v-model="clientFormData.roles"
                class="form-select"
                multiple
                aria-label="multiple select roles"
              >
                <option
                  v-for="(role, i) of roles"
                  :key="i"
                >
                  {{ role }}
                </option>
              </select>
              <p
                v-else
                class="text-center text-secondary fst-italic"
              >
                No roles defined
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <button
          type="submit"
          class="btn btn-primary"
        >
          Save
        </button>
      </div>
    </form>
  </div>
  <CtrlNoPermissions v-else />
</template>
