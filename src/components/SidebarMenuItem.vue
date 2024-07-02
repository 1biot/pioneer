<script setup>
import { computed } from 'vue'

const disconnectEmit = defineEmits(['disconnect'])
const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  head: {
    type: String,
    default: undefined
  },
  title: {
    type: String,
    required: true,
    default: undefined
  },
  link: {
    type: String,
    default: undefined
  },
  icon: {
    type: String,
    default: undefined
  },
  isActive: {
    type: Boolean,
    default: undefined
  },
  emit: {
    type: String,
    default: undefined
  }
})
const linkClasses = computed(() => {
  const classes = ['nav-link']
  if (props.disabled) {
    classes.push('text-secondary')
  } else if (typeof props.isActive === 'boolean') {
    if (props.isActive) classes.push('router-link-active')
  }

  return classes
})
function customEmit () {
  if (props?.emit === 'disconnect') {
    disconnectEmit(props.emit)
  }
}
</script>

<template>
  <li
    v-if="show && head"
    class="head text-bg-secondary"
  >
    <div class="px-2 py-1 fs-6">
      {{ head }}
    </div>
  </li>
  <li
    v-if="show"
    class="nav-item"
  >
    <router-link
      v-if="link"
      :to="link"
      class="nav-link"
      :class="linkClasses"
    >
      <i
        v-if="icon"
        class="fs-5"
        :class="icon"
      />
      <span class="ms-1 p-0 ps-1 fs-6 fw-light">{{ title }} </span>
    </router-link>
    <a
      v-else
      :class="linkClasses"
      role="button"
      @click="customEmit"
    >
      <i
        v-if="icon"
        class="fs-5"
        :class="icon"
      />
      <span class="ms-1 p-0 ps-1 fs-6 fw-light">{{ title }}</span>
    </a>
  </li>
</template>

<style scoped>
ul li a {
  padding: 10px 14px;
  display: block;
  color: #fff;
}
ul.components li:hover, ul.components li a.router-link-active {
  background-color: var(--bs-white);
  color: var(--bs-dark);
}
.active ul.components li a.router-link-active {
  border-left: 4px solid var(--bs-danger)
}
ul.components li:hover a {
  color: var(--bs-dark);
}
.active ul.components li a {
  padding: 8px 0;
}
.active ul.components li a i {
  margin-right: 0;
  display: block;
}
.active ul.components li.head {
  padding-bottom: 1px;
}
.active ul.components li a span, .active ul.components li.head div {
  display: none;
  -webkit-transition: all 100ms;
  transition: all 100ms;
}
</style>
