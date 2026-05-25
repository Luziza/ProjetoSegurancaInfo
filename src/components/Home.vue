<script setup lang="ts">
import Primeiro from '@/components/Primeiro.vue';
</script>

<template>

  <v-main>
    <Primeiro />
    <router-view />
  </v-main>

</template>

<style scoped>
:global(html),
:global(body) {
  font-size: 13px;
}
</style>
