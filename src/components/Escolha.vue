<script setup lang="ts">
import useModulo, { useModulosEscolhido } from '@/api/composables/useModulo'
import type { Modulos } from '@/types/modulo'
import { ref, type Ref } from 'vue'
import Perguntas2 from '@/components/Perguntas2.vue'
import Perguntas1 from '@/components/Perguntas1.vue'

const props = defineProps<{
  modulosMutation: ReturnType<typeof useModulo>
  empresaCriada: number
}>()

const moduloEscolhido = ref<number>(0)
const abrirModulos = ref(false)

// ✅ chamado direto no setup, passando o ref — não dentro de computed
const modulosEscolha = useModulosEscolhido(moduloEscolhido)

function selecionar(modulo: Modulos) {
  moduloEscolhido.value = modulo.tipo_pergunta
  abrirModulos.value = true
}
</script>

<template>
  <div>
    <div v-if="!abrirModulos">
      <v-btn
        v-for="modulo in props.modulosMutation.data.value"
        :key="modulo.tipo_pergunta"
        @click="selecionar(modulo)"
      >
        {{ modulo.nome }}
      </v-btn>
    </div>

    <div v-else>
      <Perguntas1 v-if="moduloEscolhido === 1" :modulosEscolha="modulosEscolha" />
      <Perguntas2 v-else-if="moduloEscolhido === 2" :modulosEscolha="modulosEscolha" :empresaCriada="props.empresaCriada" />
    </div>
  </div>
</template>