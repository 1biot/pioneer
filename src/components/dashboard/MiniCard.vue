<script setup>
import { computed } from 'vue'
import { useTopicCounterStore } from '../../stores/topicCounter'
import { formatBytes, isNumeric, toLocaleNumber } from '../../utils'

const topicCounterStore = useTopicCounterStore()
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'ri-information-line'
  },
  bgColor: {
    type: String,
    default: 'bg-info'
  },
  textColor: {
    type: String,
    default: 'text-light'
  }
})

const titleStyle = computed(() => {
  return isCardTextNaN(
    formatCardText(
      topicCounterStore.getTopicValue(props.topic)
    )
  )
    ? ['text-secondary', 'fst-italic']
    : ['']
})
const textStyle = computed(() => {
  return isCardTextNaN(
    formatCardText(
      topicCounterStore.getTopicValue(props.topic)
    )
  )
    ? ['text-secondary', 'fst-italic']
    : ['']
})
const bgColor = computed(() => {
  return isCardTextNaN(
    formatCardText(
      topicCounterStore.getTopicValue(props.topic)
    )
  )
    ? 'bg-secondary'
    : props.bgColor
})
const textColor = computed(() => {
  return isCardTextNaN(
    formatCardText(
      topicCounterStore.getTopicValue(props.topic)
    )
  )
    ? 'text-dark'
    : props.textColor
})
const icon = computed(() => {
  return isCardTextNaN(
    formatCardText(
      topicCounterStore.getTopicValue(props.topic)
    )
  )
    ? 'ri-question-mark'
    : props.icon
})
const cardText = computed(() => {
  const cardText = formatCardText(topicCounterStore.getTopicValue(props.topic))
  if (isCardTextNaN(cardText)) {
    return 'unavailable'
  }

  return cardText
})
function formatCardText (cardText) {
  if (isNumeric(cardText)) {
    if (props.unit === 'bytes') return formatBytes(cardText)
    else return toLocaleNumber(cardText)
  } else return cardText
}
function isCardTextNaN (cardText) {
  if (typeof cardText === 'string') return false
  return isNaN(cardText)
}
</script>

<template>
  <div class="col col-lg-4 col-xl-3 col-12 col-sm-12 col- mb-3">
    <div class="card shadow">
      <div class="card-body">
        <div
          class="info-box-icon float-start rounded me-3 mt-1 mt-lg-0"
          :class="[bgColor, textColor]"
        >
          <i
            class="fs-1 p-3"
            :class="icon"
          />
        </div>
        <h5
          class="card-title"
          :class="titleStyle"
        >
          {{ title }}
        </h5>
        <h6
          class="card-text pt-0 pt-sm-2"
          :class="textStyle"
        >
          {{ cardText }}
        </h6>
      </div>
    </div>
  </div>
</template>
