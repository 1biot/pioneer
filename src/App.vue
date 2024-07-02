<script setup>
import Sidebar from './components/Sidebar.vue'
import Navigation from './components/Navigation.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="wrapper d-flex align-items-stretch">
    <Sidebar />
    <div class="col-sm min-vh-100">
      <Navigation />
      <div class="container-fluid px-lg-4">
        <router-view />
      </div>
    </div>
  </div>
  <Footer />
</template>

<style>
.pointer {
    cursor: pointer;
}
.notAllowed {
    cursor: not-allowed;
}
.help-pointer {
    cursor: help;
}
</style>
