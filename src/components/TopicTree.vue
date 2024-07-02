<script setup>
import { computed } from 'vue'
import { useAppStateStore } from '../stores/appState'
import { useTopicCounterStore } from '../stores/topicCounter'
import TreeItem from './TreeItem.vue'

const appStateStore = useAppStateStore()
const topicCounterStore = useTopicCounterStore()

const tree = computed(() => {
  return {
    topic: appStateStore.host,
    root: true,
    children: topicCounterStore.topicTree
  }
})

</script>

<template>
  <ul class="topic-tree">
    <TreeItem
      class="item"
      :model="tree"
    />
  </ul>
</template>

<style scoped>
ul.topic-tree {
  padding-left: 0;
}
</style>
