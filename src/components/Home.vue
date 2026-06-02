<script setup lang="ts">
import Primeiro from '@/components/Primeiro.vue';
import CriarUsuario from './Usuario/CriarUsuario.vue';
import Login from './Usuario/Login.vue';
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
