<script setup>
import { useAppStateStore } from '../stores/appState'
import SidebarMenu from './SidebarMenu.vue'
const appStateStore = useAppStateStore()
</script>

<template>
  <div
    id="sidebar"
    class="bg-dark min-vh-100"
    :class="{'active': !appStateStore.sidebarOpen}"
  >
    <nav class="navbar navbar-dark bg-primary sticky-top">
      <router-link
        class="navbar-brand ps-3"
        to="/"
      >
        <i class="ri-flashlight-line" />
        <span class="ms-1 p-0 ps-1 fs-5">Pioneer 3</span>
      </router-link>
    </nav>
    <SidebarMenu />
  </div>
</template>

<style scoped>
#sidebar {
  min-width: 165px;
  max-width: 165px;
  -webkit-transition: all .05s;
  -o-transition: all .05s;
  transition: all .05s;
}
li.navbar-brand {
  padding-top: 7px;
  padding-bottom: 8px;
}
#sidebar.active {
  min-width: 50px;
  max-width: 50px;
  text-align: center;
}
#sidebar.active li.navbar-brand {
  padding-bottom: 8px;
}
#sidebar.active nav.navbar a.navbar-brand span {
  display: none;
  -webkit-transition: all 150ms;
  transition: all 150ms;
}
</style>
