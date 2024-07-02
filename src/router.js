import { createRouter, createWebHashHistory } from 'vue-router'
import { useMQTT } from 'mqtt-vue-hook'

const beforeEnterLogin = (to, from, next) => {
  const mqttHook = useMQTT()
  if (mqttHook.isConnected()) next('/dashboard')
  else next()
}
const beforeEnterAuth = (to, from, next) => {
  const mqttHook = useMQTT()
  if (mqttHook.isConnected()) next()
  else next('/')
}

const Dashboard = () => import('./views/Dashboard.vue')
const Connect = () => import('./views/Connect.vue')
const NotFound = () => import('./views/NotFound.vue')
const Settings = () => import('./views/Settings.vue')
const TopicTree = () => import('./views/TopicTree.vue')

const connectRoute = {
  path: '/',
  component: Connect,
  beforeEnter: beforeEnterLogin
}

const dashboardRoute = {
  path: '/dashboard',
  component: Dashboard,
  beforeEnter: beforeEnterAuth
}

const topicTreeRoute = {
  path: '/topic-tree',
  component: TopicTree,
  beforeEnter: beforeEnterAuth
}

const settingsRoute = {
  path: '/settings',
  component: Settings
}

const notFoundRoute = {
  path: '/:pathMatch(.*)*',
  component: NotFound
}

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    connectRoute,
    dashboardRoute,
    topicTreeRoute,
    settingsRoute,
    notFoundRoute
  ]
})
