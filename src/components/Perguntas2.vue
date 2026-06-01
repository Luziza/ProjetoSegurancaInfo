<script setup lang="ts">
import type { useModulosEscolhido } from '@/api/composables/useModulo'

const props = defineProps<{
  modulosEscolha: ReturnType<typeof useModulosEscolhido>
}>()
</script>

<template>
  <ul>
    <li
      v-for="(pergunta, index) in modulosEscolha.data.value?.perguntas"
      :key="index"
    >
      {{ pergunta.pergunta }}
    </li>
  </ul>
</template>

