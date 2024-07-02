<script setup>
import MiniCard from '../components/dashboard/MiniCard.vue'
import StatusCard from '../components/dashboard/StatusCard.vue'
import BytesCard from '../components/dashboard/BytesCard.vue'
import ClientsCard from '../components/dashboard/ClientsCard.vue'
import MessagesCard from '../components/dashboard/MessagesCard.vue'
import StatsCard from '../components/dashboard/StatsCard.vue'
import LineChart from '../components/dashboard/LineChart.vue'
import { formatBytes } from '../utils'
</script>

<template>
  <div class="row mt-4">
    <StatusCard />
    <MiniCard
      title="SENT"
      topic="$SYS/broker/messages/sent"
      bg-color="bg-info"
      text-color="text-dark"
      icon="ri-chat-upload-line"
    />
    <MiniCard
      title="SENT 5m"
      topic="$SYS/broker/load/messages/sent/5min"
      bg-color="bg-info"
      text-color="text-dark"
      icon="ri-chat-history-line"
    />
    <MiniCard
      title="CLIENTS"
      topic="$SYS/broker/clients/connected"
      text-color="text-white"
      icon="ri-group-2-line"
    />
    <MiniCard
      title="HEAP"
      topic="$SYS/broker/heap/current"
      unit="bytes"
      bg-color="bg-warning"
      text-color="text-dark"
      icon="ri-fire-line"
    />
    <MiniCard
      title="RECEIVED"
      topic="$SYS/broker/messages/received"
      bg-color="bg-primary"
      text-color="text-white"
      icon="ri-chat-download-line"
    />
    <MiniCard
      title="RECEIVED last 5m"
      topic="$SYS/broker/load/messages/received/5min"
      bg-color="bg-primary"
      icon="ri-chat-history-line"
    />
    <MiniCard
      title="SUBSCRIPTIONS"
      topic="$SYS/broker/subscriptions/count"
      text-color="text-white"
      icon="ri-user-voice-line"
    />
  </div>
  <div class="row">
    <StatsCard />
    <MessagesCard />
    <BytesCard />
    <ClientsCard />
  </div>
  <div class="row">
    <LineChart
      topic="$SYS/broker/heap/current"
      title="HEAP"
      icon="ri-fire-fill"
      :label-decorator="formatBytes"
    />
    <LineChart
      topic="$SYS/broker/clients/connected"
      title="Clients"
      icon="ri-group-2-fill"
    />
  </div>
</template>
