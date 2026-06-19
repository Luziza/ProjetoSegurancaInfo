<script setup lang="ts">
import useAvaliacao from '@/api/composables/useAvaliacao';
const props = defineProps<{
  empresaCriada: number
}>()

const avaliacao = useAvaliacao()

</script>

<template>

</template>