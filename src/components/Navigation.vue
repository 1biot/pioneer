<script setup>
import { computed } from 'vue'
import { useAppStateStore } from '../stores/appState'
import Metrics from './Metrics.vue'

const appStateStore = useAppStateStore()

const statusClassColor = computed(() => {
  if (appStateStore.isConnecting) return 'text-secondary'
  if (appStateStore.isConnected) return 'text-success'
  return 'text-white'
})
const host = computed(() => {
  if (appStateStore.isConnecting) return 'connecting...'
  if (appStateStore.isConnected) return appStateStore.host
  return 'not connected'
})
</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top"
  >
    <div class="container-fluid">
      <a
        id="sidebarCollapse"
        class="navbar-brand"
        :class="statusClassColor"
        type="button"
        @click="appStateStore.toggleSidebar"
      >
        <i class="ri-bar-chart-horizontal-fill" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div
        id="navbarSupportedContent"
        class="collapse navbar-collapse"
      >
        <Metrics />
        <ul class="navbar-nav mb-0">
          <li
            v-if="appStateStore.isConnected"
            class="nav-item"
          >
            <RouterLink
              title="Connected as"
              to="/clients"
              class="nav-link fs-6"
            >
              <i class="ri-user-line" />
              {{ appStateStore.clientName }}
            </RouterLink>
          </li>
          <li class="nav-item">
            <a
              class="nav-link fs-6"
              role="button"
              aria-expanded="false"
            >
              <i
                class="ri-server-line pe-1"
              />
              {{ host }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
