<script setup>
import { computed, reactive } from 'vue'
import { dateTimeFormat } from '../utils'
import { useTopicSeriesStore } from '../stores/topicSeries'

const topicSeriesStore = useTopicSeriesStore()
const filterForm = reactive({
  severity: '',
  records: -15,
  message: ''
})
const logs = computed(() => {
  const logItems = filterForm.records
    ? topicSeriesStore.findByTopic('$SYS/broker/log').slice(filterForm.records)
    : topicSeriesStore.findByTopic('$SYS/broker/log')

  const prepareItems = logItems.map(logItem => {
    const { topic, message } = logItem
    const logSeverity = topic.split('/').pop()

    const match = message.match(/^((?<logDateTime>(?<logDate>\d{4}-\d{2}-\d{2})T(?<logTime>\d{2}:\d{2}:\d{2}))|(P<timestamp>\d{1,10})):(?<logMessage>[ -?|(\w/.]+)/)
    const { logDateTime, logMessage } = match.groups

    const logDate = new Date()
    logDate.setTime(Date.parse(logDateTime))

    return {
      severity: logSeverity.trim(),
      date: logDate,
      message: logMessage.trim(),
      originalMessage: message
    }
  })

  const severityItems = prepareItems.filter((logItem) => {
    if (filterForm.severity !== '') {
      return logItem.severity === filterForm.severity
    }

    return true
  })

  // const test = prepareItems.filter((logItem) => {
  //   return logItem.message.includes('metrics-agent')
  // })

  // console.log(test[test.length - 1].message)
  // console.log(test[test.length - 1].message.includes('disconnected') ? 'disconnected' : 'connected')

  return severityItems.filter((logItem) => {
    if (filterForm.message !== '') {
      return logItem.originalMessage.includes(filterForm.message) ||
            logItem.message.includes(filterForm.message) ||
            logItem.originalMessage.toLowerCase().includes(filterForm.message) ||
            logItem.message.toLowerCase().includes(filterForm.message)
    }

    return true
  })
})
const hasFilter = computed(() => {
  return filterForm.severity !== '' || filterForm.message !== ''
})
const severityForm = [
  {
    label: 'Error',
    value: 'E'
  },
  {
    label: 'Warning',
    value: 'W'
  },
  {
    label: 'Info',
    value: 'I'
  },
  {
    label: 'Notice',
    value: 'N'
  }
]
const recordsForm = [
  {
    label: 'default',
    value: -15
  },
  {
    label: 'last 50',
    value: -50
  },
  {
    label: 'last 100',
    value: -100
  },
  {
    label: 'all',
    value: 0
  }
]

function bgClassLogItem (logItem) {
  switch (logItem.severity) {
    case 'E':
      return 'table-danger'
    case 'W':
      return 'table-warning'
    case 'I':
      return 'table-info'
    default:
      return 'table-light'
  }
}
function btnClassSeverity (severity) {
  switch (severity) {
    case 'E':
      return 'bg-danger'
    case 'W':
      return 'bg-warning'
    case 'I':
      return 'bg-info'
    default:
      return 'bg-light'
  }
}
function formatTime (date) {
  return dateTimeFormat(new Date(date), 'medium')
}
</script>

<template>
  <button
    v-for="field of recordsForm"
    :key="field.label"
    class="btn btn-sm btn-primary me-2 mb-3 shadow-sm mt-4"
    @click="filterForm.records = field.value"
  >
    {{ field.label }}
  </button>
  <button
    v-for="field of severityForm"
    :key="field.label"
    class="btn btn-sm ms-2 mb-3 border float-end shadow-sm mt-4"
    :class="btnClassSeverity(field.value)"
    @click="filterForm.severity = field.value"
  >
    {{ field.label }}
  </button>
  <div class="card shadow">
    <div class="card-body py-3">
      <table
        v-if="logs.length"
        class="table table-hover table-striped"
      >
        <thead>
          <tr>
            <th class="col-lg-2">
              Date/Time
            </th>
            <th>Message</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(logItem, i) of logs"
            :key="i"
            :class="bgClassLogItem(logItem)"
          >
            <td>{{ formatTime(logItem.date) }}</td>
            <td>{{ logItem.message }}</td>
            <td>
              <i
                class="ri-file-list-fill"
                :title="logItem.originalMessage"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-else-if="hasFilter"
        class="container mt-3"
      >
        <p class="text-center text-secondary fst-italic">
          No log entries found.
        </p>
      </div>
      <div
        v-else
        class="container mt-3"
      >
        <p class="text-center text-secondary fst-italic">
          No log entries found. If you want to see any data here you need to setup your Mosquitto broker and add this line:
          <code>log_dest topic</code><br>to your config and set read permissions to the <code>$SYS/broker/log</code> topic.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
