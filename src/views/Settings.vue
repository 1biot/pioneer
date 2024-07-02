<script setup>
import { onMounted, ref } from 'vue'
import { useAppStateStore } from '../stores/appState'

const appStateStore = useAppStateStore()

const locales = ref(appStateStore.locales)
const showIncomingTopic = ref(appStateStore.showIncomingTopic)
const tooltips = ref([])

onMounted(() => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  // eslint-disable-next-line no-undef
  tooltips.value = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
})

function setLocales (event) {
  appStateStore.setLocales(event.target.value)
}
function setShowIncomingTopic (event) {
  appStateStore.setShowIncomingTopic(event.target.value === 'true')
}
</script>

<template>
  <div class="card shadow mt-4">
    <div class="card-header text-bg-light">
      <h1 class="h4 mb-0 pt-1">
        Settings
      </h1>
    </div>
    <div class="card-body">
      <div class="row my-4">
        <label class="col-lg-2 col-sm-6 col-form-label text-lg-end text-sm-end fw-bold">Time and numbers locale:</label>
        <div class="col-lg-2 col-sm-6">
          <select
            v-model="locales"
            class="form-select"
            @change="setLocales"
          >
            <option value="cs-CZ">
              Česky
            </option>
            <option value="de-DE">
              Deutch
            </option>
            <option value="en-US">
              English
            </option>
          </select>
        </div>
      </div>
      <div class="row my-4">
        <label class="col-lg-2 col-sm-6 col-form-label text-lg-end text-sm-end fw-bold">Visualize incoming topic:</label>
        <div class="col-lg-2 col-sm-6 align-middle">
          <div class="form-check form-switch">
            <label class="form-check-label">
              <input
                v-model="showIncomingTopic"
                true-value="true"
                false-value="false"
                class="form-check-input pointer"
                type="checkbox"
                :value="showIncomingTopic"
                @change="setShowIncomingTopic"
              >
            </label>
            <i
              class="ri-question-line fs-4 text-secondary help-pointer"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-title="Turning it off can have a positive effect on the responsiveness of the application."
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
