import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTopicSeriesStore = defineStore('topicSeries', () => {
  const $SYS = ref([])
  const $METRICS = ref([])
  const $LOGS = ref([])

  function pushToBucket (topic, message) {
    const bucket = getBucket(topic)
    if (typeof bucket === 'undefined') return false
    bucket.value.push({
      date: new Date(),
      topic,
      message: message.toString()
    })
    const bucketLimit = topic.startsWith('$SYS/broker/log') ? 500 : 100
    if (bucket.value.length > bucketLimit) {
      bucket.value.splice(0, bucket.value.length - bucketLimit)
    }
  }

  function getBucket (topic) {
    let bucket
    if (topic.startsWith('$SYS')) {
      bucket = topic.startsWith('$SYS/broker/log') ? $LOGS : $SYS
    } else if (topic.startsWith('$METRICS')) {
      bucket = $METRICS
    }

    return bucket
  }

  function filterByTopic (topic) {
    const bucket = getBucket(topic)
    if (typeof bucket === 'undefined') return false
    return bucket.value.filter((item) => item.topic === topic)
  }

  function findByTopic (topic) {
    const bucket = getBucket(topic)
    if (typeof bucket === 'undefined') return false
    return bucket.value.filter((item) => item.topic.startsWith(topic))
  }

  function count () {
    return $SYS.value.length + $METRICS.value.length + $LOGS.value.length
  }

  function $reset () {
    $SYS.value.length = 0
    $METRICS.value.length = 0
    $LOGS.value.length = 0
  }

  return {
    pushToBucket,
    filterByTopic,
    findByTopic,
    count,
    $reset
  }
})
