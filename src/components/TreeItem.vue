<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStateStore } from '../stores/appState'
import { useTopicCounterStore } from '../stores/topicCounter'

const appStateStore = useAppStateStore()
const topicCounterStore = useTopicCounterStore()
const props = defineProps({
  model: {
    type: Object,
    default: undefined
  }
})
const isActual = ref(false)
const isOpenDefault = ref(true)
const isFolder = computed(() => {
  return props.model.children && props.model.children.length
})
const renderTopicCounterMessage = computed(() => {
  if (props.model.root) {
    const { messages, topics } = topicCounterStore.getOverallCounter()
    return `${topics} topics, ${messages} messages`
  }

  return `${topicCounterStore.getSubtopicCounter(props.model.topic)} subtopics, ${props.model?.counter || 0} messages`
})
const isOpen = computed(() => {
  const topic = topicCounterStore.getTopic(props.model.topic)
  if (!topic) return isOpenDefault.value
  return props.model?.isOpen
})
const payload = computed(() => {
  const source = props?.model?.packet?.payload?.toString()
  if (source?.length > 90) return source.slice(0, 90 - 1) + '…'
  return source
})
watch(renderTopicCounterMessage, () => {
  if (!appStateStore?.showIncomingTopic) return
  isActual.value = true
  setTimeout(() => {
    isActual.value = false
  }, 300)
})

function toggleTreeItem () {
  if (isFolder.value) {
    const toggled = topicCounterStore.toggleOpen(props.model.topic)
    if (toggled) return
    isOpenDefault.value = !isOpenDefault.value
  } else {
    const activeTopic = topicCounterStore.getActiveTopic()
    if (activeTopic?.topic === props.model.topic) {
      topicCounterStore.clearActiveTopic()
    } else {
      topicCounterStore.setActiveTopic(props.model.topic)
    }
  }
}
</script>

<template>
  <li
    class="mb-2 pointer"
    :class="{'is-folder': isFolder}"
  >
    <div
      class="rounded"
      :class="{'is-active': isActual, 'is-detail': model?.detail}"
      @click="toggleTreeItem"
    >
      <span class="pe-1">
        <i
          v-if="isFolder && isOpen"
          class="ri-checkbox-indeterminate-line"
        />
        <i
          v-if="isFolder && !isOpen"
          class="ri-add-box-line"
        />
        <i
          v-if="!isFolder"
          class="ri-corner-down-right-line"
        />
      </span>

      <span
        v-if="isFolder"
        class="ps-0 fw-semibold"
      >{{ model.topic.split('/').pop() }}</span>
      <span
        v-if="!isFolder"
        class="ps-0 text-dark"
      >{{ model.topic.split('/').pop() }}=</span>

      <code v-if="!isFolder">{{ payload }}</code>
      <small
        v-if="isFolder && !isOpen"
        class="text-secondary ps-2"
      >({{ renderTopicCounterMessage }})</small>
    </div>
    <ul
      v-show="isOpen"
      v-if="isFolder"
      class="mt-2"
    >
      <TreeItem
        v-for="(modelItem, i) in model.children"
        :key="i"
        :model="modelItem"
        class="item"
      />
    </ul>
  </li>
</template>

<style scoped>
ul.topic-tree ul {
  padding-left: 1.3rem;
}
ul.topic-tree li {
  list-style: none;
}
div:hover, div.is-detail {
    background-color: var(--bs-gray-500);
}
div.is-active {
    background-color: var(--bs-gray-200);
    -webkit-transition: background 0.1s ease-in, padding-right 0.1s linear, color 0.1s ease-in;
}
</style>
