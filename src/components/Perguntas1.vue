<script setup lang="ts">
import type { useEmpresa } from '@/api/composables/useEmpresa';
import type { useModulosEscolhido } from '@/api/composables/useModulo'
import { useCreateResposta } from '@/api/composables/useResposta';
import { ref } from 'vue';

const props = defineProps<{
  modulosEscolha: ReturnType<typeof useModulosEscolhido>
  empresaCriada: number
}>()

const respostaMutation = useCreateResposta()
const respostas = ref<Record<number, string>>({})

const salvar = () => {
  console.log('ID EMPRESA:', props.empresaCriada)

  const payload = Object.entries(respostas.value).map(
    ([id_pergunta, resposta]) => ({
      id_pergunta: Number(id_pergunta),
      id_empresa: props.empresaCriada,

      sim: resposta === 'SIM',
      nao: resposta === 'NAO',
      em_andamento: resposta === 'EM_ANDAMENTO',
      nao_aplica: resposta === 'NAO_APLICA',

      data: new Date().toISOString()
    })
  )
  respostaMutation.mutate(payload)
}
</script>

<template>
  <ul>
    <li v-for="pergunta in modulosEscolha.data.value?.perguntas" :key="pergunta.id_pergunta">
      <p>{{ pergunta.pergunta }}</p>

      <v-radio-group v-model="respostas[pergunta.id_pergunta]" inline>
        <v-radio label="Sim" value="SIM" />
        <v-radio label="Não" value="NAO" />
        <v-radio label="Em andamento" value="EM_ANDAMENTO" />
        <v-radio label="Não se aplica" value="NAO_APLICA" />
      </v-radio-group>
    </li>
  </ul>
  <v-btn @click="salvar">Salvar</v-btn>
</template>
