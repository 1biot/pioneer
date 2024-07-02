<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import 'chartjs-adapter-moment'
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend } from 'chart.js'
import { useTopicSeriesStore } from '../../stores/topicSeries'
import { dateTimeFormat, toLocaleNumber } from '../../utils'

const topicSeriesStore = useTopicSeriesStore()
const props = defineProps({
  topic: {
    type: String,
    default: undefined
  },
  title: {
    type: String,
    default: undefined
  },
  icon: {
    type: String,
    default: undefined
  },
  labelDecorator: {
    type: Function,
    default: toLocaleNumber
  }
})
const chartData = computed(() => {
  const chartData = topicSeriesStore.filterByTopic(props.topic)
  const mapToChart = (item) => ({ x: item.date, y: parseFloat(item.message) })

  return {
    datasets: [{
      label: props.title,
      data: chartData.map(mapToChart),
      borderColor: '#0dcaf0',
      backgroundColor: '#0dcaf0',
      borderWidth: 2
    }]
  }
})
const chartOptions = computed(() => {
  return {
    borderColor: '#0dcaf0',
    pointBackgroundColor: '#0dcaf0',
    borderWidth: 2,
    pointBorderColor: '#0dcaf0',
    // color: '#FC2525',
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top'
      }
    },
    scales: {
      x: {
        type: 'time',
        display: true,
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          callback: function (value, index, ticks) {
            return dateTimeFormat(new Date(value), {
              hour12: false,
              timeStyle: 'medium'
            })
          },
          minRotation: 10,
          maxRotation: 80
        }
      },
      y: {
        ticks: {
          callback: function (value, index, ticks) {
            return props.labelDecorator(value, 3)
          }
        }
      }
    }
  }
})

ChartJS.register(LineElement, PointElement, LineController, LinearScale, TimeScale, Tooltip, Legend)
</script>

<template>
  <div
    v-if="chartData.datasets[0].data.length"
    class="col col-lg-6 col-12 col-sm-12 col-md-4 mb-3 d-none d-sm-block"
  >
    <div class="card shadow">
      <div class="card-body">
        <div class="card-title">
          <h3>
            <i
              class="fs-3 pe-1"
              :class="icon"
            />
            {{ title }}
          </h3>
        </div>
        <Line
          v-if="chartData.datasets[0].data.length > 1"
          v-memo="[chartData]"
          :data="chartData"
          :options="chartOptions"
        />
        <p
          v-else
          class="fst-italic text-center text-secondary mt-3"
        >
          Only one datapoint
        </p>
      </div>
    </div>
  </div>
</template>
