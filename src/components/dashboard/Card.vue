<script setup>
defineProps({
  title: {
    type: String,
    default: undefined
  },
  icon: {
    type: String,
    default: undefined
  },
  text: {
    type: String,
    default: undefined
  },
  list: {
    type: Array,
    default () {
      return []
    }
  }
})
</script>

<template>
  <div class="col col-lg-4 col-xl-3 col-12 col-sm-12 col-md-4 mb-3">
    <div class="card shadow">
      <div class="card-header fw-bold">
        <i
          v-if="icon"
          class="fs-5 pe-2"
          :class="icon"
        />
        {{ title }}
      </div>
      <div
        v-if="text"
        class="card-body"
        :class="{'text-center': !list.length}"
      >
        <h6 class="card-text">
          {{ text }}
        </h6>
      </div>
      <ul
        v-if="list.length"
        class="list-group list-group-flush"
      >
        <li
          v-for="(dataItem, i) of list"
          :key="i"
          class="list-group-item d-flex justify-content-between align-items-center px-2 px-sm-3"
        >
          {{ dataItem.label }}
          <span class="badge border border-secondary text-dark rounded-pill px-2 px-sm-3">{{ dataItem.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
