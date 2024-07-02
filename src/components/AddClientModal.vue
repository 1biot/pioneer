<script setup>
import { onBeforeMount, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMQTT } from 'mqtt-vue-hook'
import { useToast } from 'vue-toast-notification'
import { useAppStateStore } from '../stores/appState'
import { CONTROL_TOPIC, CONTROL_TOPIC_RESPONSE } from '../types'
import ClientValidation from '../schemas/clientValidation'

const router = useRouter()
const mqttHook = useMQTT()
const appStateStore = useAppStateStore()
const $toast = useToast()

const formData = reactive({
  username: '',
  password: '',
  clientid: '',
  textname: '',
  textdescription: '',
  groups: [],
  roles: []
})
const Validation = reactive({
  error: [],
  fieldErrors: function (field) {
    return this.error.filter(errorItem => errorItem.context.key === field)
  },
  hasError: function (field) {
    return this.fieldErrors(field).length > 0
  }
})
const groups = reactive([])
const roles = reactive([])
const emit = defineEmits(['closeModal'])

onBeforeMount(async () => {
  if (!appStateStore?.hasCtrlAccess) return
  await mqttHook.registerEvent(CONTROL_TOPIC_RESPONSE, processMqttResponse, 'clientModal')
  getMqttGroupsAndRoles()
})
onUnmounted(async () => {
  if (!appStateStore?.hasCtrlAccess) return
  await mqttHook.unRegisterEvent(CONTROL_TOPIC_RESPONSE, 'clientModal')
})

function processMqttResponse (topic, message) {
  const responses = JSON.parse(message.toString())?.responses || []
  if (!responses.length) return
  for (const response of responses) {
    if (response.error) return $toast.error(response.error)
    else if (['createClient', 'modifyClient'].includes(response.command)) {
      const toastMessage = `User has been ${response.command === 'createClient' ? 'created' : 'updated'}`
      $toast.success(toastMessage)
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
    }
  }
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
function processFormData () {
  const result = ClientValidation.create.validate(formData)
  if (result.error) {
    Validation.error = result.error.details
    return
  }

  return insertClient({ ...formData })
}
function insertClient (newClient) {
  newClient.groups = newClient.groups.map(groupItem => ({ groupname: groupItem }))
  newClient.roles = newClient.roles.map(roleItem => ({ rolename: roleItem }))

  const payload = { commands: [] }
  let clientPayload = { command: 'createClient' }
  clientPayload = { ...clientPayload, ...newClient }
  payload.commands.push(clientPayload)
  mqttHook.publish(CONTROL_TOPIC, JSON.stringify(payload))
  emit('closeModal')
}
</script>

<template>
  <div
    id="client-modal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    data-bs-backdrop="static"
  >
    <div
      class="modal-dialog modal-md modal-fullscreen-md-down modal-dialog-scrollable"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Add Client
          </h5>
          <button
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <form @submit.prevent="processFormData">
          <div class="modal-body">
            <ul
              id="myTab"
              class="nav nav-tabs mb-4"
              role="tablist"
            >
              <li
                class="nav-item"
                role="presentation"
              >
                <button
                  id="home-tab"
                  class="nav-link active"
                  data-bs-toggle="tab"
                  data-bs-target="#home"
                  type="button"
                  role="tab"
                  aria-controls="home"
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
                  id="profile-tab"
                  class="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                  type="button"
                  role="tab"
                  aria-controls="profile"
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
                  id="contact-tab"
                  class="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#contact"
                  type="button"
                  role="tab"
                  aria-controls="contact"
                  aria-selected="false"
                >
                  Roles
                </button>
              </li>
            </ul>
            <div
              id="myTabContent"
              class="tab-content px-2"
            >
              <div
                id="home"
                class="tab-pane show active"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div class="mb-1">
                  <label
                    for="client-username"
                    class="col-form-label"
                  >Username:</label>
                  <input
                    id="client-username"
                    v-model="formData.username"
                    type="text"
                    class="form-control"
                    :class="{'is-invalid': Validation.hasError('username')}"
                  >
                  <small
                    v-for="(error, i) of Validation.fieldErrors('username')"
                    :key="i"
                    class="invalid-feedback"
                  >{{ error.message }}</small>
                </div>
                <div class="mb-1">
                  <label
                    for="client-password"
                    class="col-form-label"
                  >Password:</label>
                  <input
                    id="client-password"
                    v-model="formData.password"
                    type="password"
                    class="form-control"
                    :class="{'is-invalid': Validation.hasError('password')}"
                  >
                  <small
                    v-for="(error, i) of Validation.fieldErrors('password')"
                    :key="i"
                    class="invalid-feedback"
                  >{{ error.message }}</small>
                </div>
                <div class="mb-1">
                  <label
                    for="client-id"
                    class="col-form-label"
                  >Client ID:</label>
                  <input
                    id="client-id"
                    v-model="formData.clientid"
                    type="text"
                    class="form-control"
                    :class="{'is-invalid': Validation.hasError('clientid')}"
                  >
                  <small
                    v-for="(error, i) of Validation.fieldErrors('clientid')"
                    :key="i"
                    class="invalid-feedback"
                  >{{ error.message }}</small>
                </div>
                <div class="mb-1">
                  <label
                    for="client-textname"
                    class="col-form-label"
                  >Name:</label>
                  <input
                    id="client-textname"
                    v-model="formData.textname"
                    type="text"
                    class="form-control"
                    :class="{'is-invalid': Validation.hasError('textname')}"
                  >
                  <small
                    v-for="(error, i) of Validation.fieldErrors('textname')"
                    :key="i"
                    class="invalid-feedback"
                  >{{ error.message }}</small>
                </div>
                <div class="mb-1">
                  <label class="col-form-label">Description:</label>
                  <textarea
                    id="client-textdescription"
                    v-model="formData.textdescription"
                    class="form-control"
                    :class="{'is-invalid': Validation.hasError('textdescription')}"
                  />
                  <small
                    v-for="(error, i) of Validation.fieldErrors('textdescription')"
                    :key="i"
                    class="invalid-feedback"
                  >{{ error.message }}</small>
                </div>
              </div>
              <div
                id="profile"
                class="tab-pane px-2"
                role="tabpanel"
                aria-labelledby="profile-tab"
              >
                <div class="mb-1">
                  <select
                    v-if="groups.length"
                    v-model="formData.groups"
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
                    No groups defined. You need to <a
                      class="pointer"
                      data-bs-dismiss="modal"
                      @click="router.push('/groups')"
                    >define</a> any.
                  </p>
                </div>
              </div>
              <div
                id="contact"
                class="tab-pane px-2"
                role="tabpanel"
                aria-labelledby="contact-tab"
              >
                <div class="mb-1">
                  <select
                    v-if="roles.length"
                    v-model="formData.roles"
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
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              Close
            </button>
            <button
              type="submit"
              class="btn btn-primary"
            >
              Insert
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
