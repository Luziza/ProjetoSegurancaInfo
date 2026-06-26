<script setup lang="ts">
import useModulo, { useModulosEscolhido } from '@/api/composables/useModulo'
import type { Modulos } from '@/types/modulo'
import { ref } from 'vue'
import Perguntas1 from '@/components/Perguntas1.vue'
import Perguntas2 from '@/components/Perguntas2.vue'

const props = defineProps<{
  modulosMutation: ReturnType<typeof useModulo>
  empresaCriada: number
}>()

const emit = defineEmits(['fechar'])

const moduloEscolhido = ref(0)
const perguntasAbertas = ref(false)

const modulosEscolha = useModulosEscolhido(moduloEscolhido)

function selecionar(modulo: Modulos) {
  moduloEscolhido.value = modulo.tipo_pergunta
  perguntasAbertas.value = true
}

function fechar() {
  emit('fechar')
}
</script>

<template>
  <div>
    <div v-if="!perguntasAbertas" class="container">

      <div class="header">
        <span>Escolha um questionário</span>

        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="fechar"
        />
      </div>

      <div class="lista">

        <v-btn
          v-for="modulo in props.modulosMutation.data.value"
          :key="modulo.tipo_pergunta"
          block
          variant="outlined"
          color="primary"
          class="mb-2"
          @click="selecionar(modulo)"
        >
          {{ modulo.nome }}
        </v-btn>

      </div>

    </div>

    <Perguntas1
      v-if="perguntasAbertas && moduloEscolhido === 1"
      :empresaCriada="empresaCriada"
      :modulosEscolha="modulosEscolha"
    />

    <Perguntas2
      v-if="perguntasAbertas && moduloEscolhido === 2"
      :empresaCriada="empresaCriada"
      :modulosEscolha="modulosEscolha"
    />
  </div>
</template>

<style scoped>
.container{
    display:flex;
    flex-direction:column;
}

.header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    font-size:18px;
    font-weight:600;
}

.lista{
    display:flex;
    flex-direction:column;
    overflow:auto;
}
</style>