import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

const disallowedInternalTopics = ['on-connect', 'on-reconnect', 'on-disconnect', 'on-connect-fail']

function createNode (topic, packet = undefined, parent = '', leaf = false, root = false) {
  return {
    topic,
    packet,
    parent,
    leaf,
    root,
    children: [],
    counter: 1,
    isOpen: false,
    detail: false
  }
}

export const useTopicCounterStore = defineStore('topicCounter', () => {
  const lastUpdate = ref((new Date()).getTime())
  const messageCounter = ref(0)
  const topicCounter = reactive([])
  const topicTree = computed(() => {
    const map = {}; let node; const roots = []; let i
    for (i = 0; i < topicCounter.length; i += 1) {
      map[topicCounter[i].topic] = i // initialize the map
      topicCounter[i].children = [] // initialize the children
    }

    for (i = 0; i < topicCounter.length; i += 1) {
      node = topicCounter[i]
      if (node.parent !== '') {
        // if you have dangling branches check that map[node.parentId] exists
        topicCounter[map[node.parent]].children.push(node)
      } else {
        roots.push(node)
      }
    }
    return roots
  })

  function pushToBucket (topic, message, packet) {
    if (disallowedInternalTopics.includes(topic) && typeof packet === 'undefined') return
    messageCounter.value++
    lastUpdate.value = (new Date()).getTime()

    const topicParts = topic.split('/')
    const tempParentArray = []
    const actualTopicArray = []
    for (const topicString of topicParts) {
      const actualParentArray = tempParentArray
      actualTopicArray.push(topicString)
      const leaf = actualTopicArray.join('/') === topic

      const topicIndex = topicCounter.findIndex(topicItem => topicItem.topic === actualTopicArray.join('/'))
      if (topicIndex !== -1) {
        topicCounter[topicIndex].counter++
        if (leaf) {
          topicCounter[topicIndex].packet = packet
        }
        tempParentArray.push(topicString)
        continue
      }

      topicCounter.push(createNode(
        actualTopicArray.join('/'),
        leaf ? packet : undefined,
        actualParentArray.join('/'),
        leaf
      ))
      tempParentArray.push(topicString)
    }

    return true
  }

  function getSubtopicCounter (topic) {
    return topicCounter.filter(topicItem => topicItem.topic.startsWith(topic) && topicItem.leaf).length
  }

  function getOverallCounter () {
    return {
      messages: messageCounter.value,
      topics: topicCounter.filter(topicItem => topicItem.leaf).length
    }
  }

  function getTopics () {
    return topicCounter
  }

  function getTopic (topic) {
    return getTopics().find(topicItem => topicItem.topic === topic)
  }

  function getActiveTopic () {
    return topicCounter.find(topicItem => topicItem.detail === true)
  }

  function setActiveTopic (topic) {
    clearActiveTopic()
    const futureActiveTopic = getTopic(topic)
    if (futureActiveTopic) {
      futureActiveTopic.detail = true
    }
  }

  function clearActiveTopic () {
    const actualActiveTopic = getActiveTopic()
    if (actualActiveTopic) {
      actualActiveTopic.detail = false
    }
  }

  function toggleOpen (topic) {
    const topicDetail = getTopic(topic)
    if (!topicDetail) {
      return false
    }
    topicDetail.isOpen = !topicDetail.isOpen
    return true
  }

  function getTopicValue (topic, defaultValue = NaN) {
    return getTopic(topic)?.packet?.payload?.toString() || defaultValue
  }

  function $reset () {
    lastUpdate.value = (new Date()).getTime()
    messageCounter.value = 0
    topicCounter.length = 0
  }

  return {
    pushToBucket,
    getOverallCounter,
    getSubtopicCounter,
    getTopics,
    getTopic,
    getTopicValue,
    getActiveTopic,
    setActiveTopic,
    clearActiveTopic,
    toggleOpen,
    lastUpdate,
    topicTree,
    $reset
  }
})
