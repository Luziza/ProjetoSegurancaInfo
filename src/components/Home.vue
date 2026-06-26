<script setup lang="ts">
import Login from './usuario/Login.vue';
</script>

<template>

  <v-main>
    <Login />
    <router-view />
  </v-main>

</template>

<style scoped>
:global(html),
:global(body) {
  font-size: 13px;
}
</style>
