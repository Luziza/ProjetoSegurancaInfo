<script setup lang="ts">
import type { useModulosEscolhido } from '@/api/composables/useModulo'
import { useCreateResposta } from '@/api/composables/useResposta'
import { computed, ref, nextTick } from 'vue'

const props = defineProps<{
  modulosEscolha: ReturnType<typeof useModulosEscolhido>
  empresaCriada: number
}>()

const respostaMutation = useCreateResposta()
const respostas = ref<Record<number, string>>({})
const slideAtual = ref(0)

const opcoes = [
  { label: 'Sim', value: 'SIM', icon: 'mdi-check-circle', color: 'success' },
  { label: 'Não', value: 'NAO', icon: 'mdi-close-circle', color: 'error' },
  { label: 'Em andamento', value: 'EM_ANDAMENTO', icon: 'mdi-progress-clock', color: 'warning' },
  { label: 'Não se aplica', value: 'NAO_APLICA', icon: 'mdi-minus-circle', color: 'grey' },
]

const perguntas = computed(() => props.modulosEscolha.data.value?.perguntas ?? [])
const totalPerguntas = computed(() => perguntas.value.length)
const respondidas = computed(() => Object.keys(respostas.value).length)
const progresso = computed(() =>
  totalPerguntas.value === 0 ? 0 : (respondidas.value / totalPerguntas.value) * 100
)
const isUltima = computed(() => slideAtual.value === totalPerguntas.value - 1)
const podeSalvar = computed(() => respondidas.value === totalPerguntas.value && totalPerguntas.value > 0)

function selecionarResposta(idPergunta: number, valor: string) {
  respostas.value[idPergunta] = valor

  // Avança automaticamente para a próxima pergunta, se houver
  nextTick(() => {
    if (!isUltima.value) {
      setTimeout(() => {
        slideAtual.value++
      }, 250)
    }
  })
}

function irPara(index: number) {
  slideAtual.value = index
}

function anterior() {
  if (slideAtual.value > 0) slideAtual.value--
}

function proxima() {
  if (slideAtual.value < totalPerguntas.value - 1) slideAtual.value++
}

const salvar = () => {
  const payload = Object.entries(respostas.value).map(
    ([id_pergunta, resposta]) => ({
      id_pergunta: Number(id_pergunta),
      idEmpresa: props.empresaCriada,
      nome: props.modulosEscolha.data.value?.nome,
      tipo_pergunta: props.modulosEscolha.data.value?.tipo_pergunta,

      sim: resposta === 'SIM',
      nao: resposta === 'NAO',
      em_andamento: resposta === 'EM_ANDAMENTO',
      nao_aplica: resposta === 'NAO_APLICA',
    })
  )
  respostaMutation.mutate(payload)
}
</script>

<template>
  <div class="questionario">
    <!-- Cabeçalho com progresso -->
    <div class="questionario__header">
      <div class="questionario__header-top">
        <span class="questionario__titulo">{{ modulosEscolha.data.value?.nome }}</span>
        <span class="questionario__contador">{{ respondidas }} / {{ totalPerguntas }}</span>
      </div>

      <v-progress-linear
        :model-value="progresso"
        height="8"
        rounded
        color="primary"
        bg-color="grey-lighten-3"
      />
    </div>

    <!-- Carrossel de perguntas -->
    <v-window v-model="slideAtual" class="questionario__window">
      <v-window-item
        v-for="(pergunta, index) in perguntas"
        :key="pergunta.id_pergunta"
      >
        <v-card class="questionario__card" elevation="0">
          <div class="questionario__numero">Pergunta {{ index + 1 }} de {{ totalPerguntas }}</div>

          <h2 class="questionario__pergunta">{{ pergunta.pergunta }}</h2>

          <div class="questionario__opcoes">
            <button
              v-for="opcao in opcoes"
              :key="opcao.value"
              type="button"
              class="opcao-btn"
              :class="[
                `opcao-btn--${opcao.color}`,
                { 'opcao-btn--ativa': respostas[pergunta.id_pergunta] === opcao.value }
              ]"
              @click="selecionarResposta(pergunta.id_pergunta, opcao.value)"
            >
              <v-icon :icon="opcao.icon" size="22" class="mr-2" />
              {{ opcao.label }}
            </button>
          </div>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Navegação -->
    <div class="questionario__nav">
      <v-btn
        variant="text"
        prepend-icon="mdi-chevron-left"
        :disabled="slideAtual === 0"
        @click="anterior"
      >
        Anterior
      </v-btn>

      <!-- Bolinhas de navegação -->
      <div class="questionario__dots">
        <button
          v-for="(pergunta, index) in perguntas"
          :key="pergunta.id_pergunta"
          class="dot"
          :class="{
            'dot--ativa': index === slideAtual,
            'dot--respondida': respostas[pergunta.id_pergunta] && index !== slideAtual
          }"
          @click="irPara(index)"
        />
      </div>

      <v-btn
        v-if="!isUltima"
        variant="text"
        append-icon="mdi-chevron-right"
        @click="proxima"
      >
        Próxima
      </v-btn>

      <v-btn
        v-else
        color="primary"
        append-icon="mdi-check"
        :disabled="!podeSalvar"
        :loading="respostaMutation.isPending?.value"
        @click="salvar"
      >
        Salvar
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.questionario {
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* Header */
.questionario__header {
  margin-bottom: 32px;
}

.questionario__header-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.questionario__titulo {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.questionario__contador {
  font-size: 0.9rem;
  color: #757575;
  font-weight: 500;
}

/* Window / carrossel */
.questionario__window {
  min-height: 320px;
}

.questionario__card {
  padding: 8px 4px 32px;
  background: transparent;
}

.questionario__numero {
  font-size: 0.85rem;
  color: #9e9e9e;
  font-weight: 500;
  margin-bottom: 12px;
}

.questionario__pergunta {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  color: #1a1a1a;
  margin-bottom: 32px;
}

/* Opções */
.questionario__opcoes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.opcao-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 20px;
  border-radius: 14px;
  border: 1.5px solid #e0e0e0;
  background: #fff;
  font-size: 1rem;
  font-weight: 500;
  color: #424242;
  cursor: pointer;
  transition: all 0.18s ease;
  text-align: left;
}

.opcao-btn:hover {
  border-color: #bdbdbd;
  background: #fafafa;
  transform: translateY(-1px);
}

.opcao-btn--ativa.opcao-btn--success {
  border-color: #4caf50;
  background: #eaf7ec;
  color: #2e7d32;
}

.opcao-btn--ativa.opcao-btn--error {
  border-color: #f44336;
  background: #fdecea;
  color: #c62828;
}

.opcao-btn--ativa.opcao-btn--warning {
  border-color: #ffc107;
  background: #fff8e1;
  color: #b28704;
}

.opcao-btn--ativa.opcao-btn--grey {
  border-color: #9e9e9e;
  background: #f0f0f0;
  color: #424242;
}

/* Navegação inferior */
.questionario__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.questionario__dots {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: none;
  background: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.dot--respondida {
  background: #90caf9;
}

.dot--ativa {
  background: #1976d2;
  width: 22px;
  border-radius: 5px;
}
</style>