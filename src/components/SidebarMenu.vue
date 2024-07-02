<script setup>
import SidebarMenuItem from './SidebarMenuItem.vue'
import SidebarMenuItemDisconnect from './SidebarMenuItemDisconnect.vue'
import { useAppStateStore } from '../stores/appState'

const appStateStore = useAppStateStore()
</script>

<template>
  <ul class="list-unstyled components mb-5">
    <SidebarMenuItem
      :show="!appStateStore.isConnected"
      title="Connect"
      link="/"
      icon="ri-login-circle-line"
    />
    <SidebarMenuItem
      :show="appStateStore.isConnected"
      :disabled="!appStateStore.hasSysAccess"
      title="Dashboard"
      link="/dashboard"
      icon="ri-dashboard-line"
    />
    <SidebarMenuItem
      :show="appStateStore.isConnected"
      title="TopicViewer"
      link="/topic-tree"
      icon="ri-node-tree"
    />
    <SidebarMenuItem
      :show="true"
      head="System"
      title="Settings"
      link="/settings"
      icon="ri-settings-3-line"
    />
    <SidebarMenuItemDisconnect />
  </ul>
</template>

<style scoped>
ul.components {
  padding: 0;
  -webkit-transition: .05s;
  -o-transition: .05s;
  transition: .05s;
}
ul li a {
  padding: 8px 14px;
  display: block;
  color: #fff;
}
.active ul.components li a span {
  display: none;
  -webkit-transition: all 150ms;
  transition: all 150ms;
}
ul.components li:hover, ul.components li a.router-link-active {
  background-color: var(--bs-light);
  color: var(--bs-dark);
}
</style>
