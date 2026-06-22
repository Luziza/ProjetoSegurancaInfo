<script setup lang="ts">
import { computed } from 'vue'
import useAvaliacao from '@/api/composables/useAvaliacao'
import type { AvaliacaoResponse } from '@/types/avaliacao'
import AvaliacaoGrafico from '@/components/AvaliacaoGrafico.vue'

const props = defineProps<{
    empresaCriada: number
}>()

const avaliacaoQuery = useAvaliacao(props.empresaCriada)

function calcularConformidade(avaliacao: AvaliacaoResponse): number {
    const respostasValidas = avaliacao.respostas.filter(
        r => !r.nao_aplica && !r.em_andamento
    )

    if (respostasValidas.length === 0) return 0

    const conformes = respostasValidas.filter(r => r.sim).length

    return Number(((conformes / respostasValidas.length) * 100).toFixed(1))
}

function calcularMedia(avaliacoes: AvaliacaoResponse[]) {
    if (avaliacoes.length === 0) return 0

    const total = avaliacoes.reduce(
        (soma, avaliacao) => soma + calcularConformidade(avaliacao),
        0
    )

    return Number((total / avaliacoes.length).toFixed(1))
}

const ultimasAvaliacoes = computed(() => {
    const lista = avaliacaoQuery.data.value ?? []

    return [...lista]
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 3)
})

const avaliacoesModulo1 = computed(() => {
    const lista = avaliacaoQuery.data.value ?? []

    return lista
        .filter(a => a.tipo_pergunta === 1)
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 3)
})

const avaliacoesModulo2 = computed(() => {
    const lista = avaliacaoQuery.data.value ?? []

    return lista
        .filter(a => a.tipo_pergunta === 2)
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 3)
})

const avaliacoesGerais = computed(() => {
    const lista = avaliacaoQuery.data.value ?? []

    return [...lista]
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 3)
})

const mediaModulo1 = computed(() => calcularMedia(avaliacoesModulo1.value))
const mediaModulo2 = computed(() => calcularMedia(avaliacoesModulo2.value))
const mediaGeral = computed(() => calcularMedia(avaliacoesGerais.value))
</script>

<template>
    <div class="dashboard">
        <h1>Dashboard de Conformidade</h1>

        <v-alert v-if="avaliacaoQuery.isLoading.value" type="info">
            Carregando avaliações...
        </v-alert>

        <v-alert v-else-if="ultimasAvaliacoes.length === 0" type="warning">
            Nenhuma avaliação encontrada.
        </v-alert>
    </div>

    <!-- Módulo 1 -->
    <h2 class="mb-2">Módulo 1</h2>
    <p class="text-h4 mb-4">Média de conformidade: {{ mediaModulo1 }}%</p>

    <v-row>
        <v-col
            v-for="avaliacao in avaliacoesModulo1"
            :key="avaliacao.id_avaliacao"
            cols="12"
            md="4"
        >
            <AvaliacaoGrafico :avaliacao="avaliacao" />
        </v-col>
    </v-row>

    <!-- Módulo 2 -->
    <h2 class="my-2">Módulo 2</h2>
    <p class="text-h4 mb-4">Média de conformidade: {{ mediaModulo2 }}%</p>

    <v-row>
        <v-col
            v-for="avaliacao in avaliacoesModulo2"
            :key="avaliacao.id_avaliacao"
            cols="12"
            md="4"
        >
            <AvaliacaoGrafico :avaliacao="avaliacao" />
        </v-col>
    </v-row>

    <!-- Geral -->
    <h2 class="my-2">Geral</h2>
    <p class="text-h4 mb-4">Média de conformidade: {{ mediaGeral }}%</p>

    <v-row>
        <v-col
            v-for="avaliacao in avaliacoesGerais"
            :key="avaliacao.id_avaliacao"
            cols="12"
            md="4"
        >
            <AvaliacaoGrafico :avaliacao="avaliacao" />
        </v-col>
    </v-row>
</template>

<style scoped>
.dashboard {
    padding: 24px;
}

.text-h3 {
    font-size: 2rem;
    font-weight: bold;
}

.text-h4 {
    font-size: 1.5rem;
    font-weight: bold;
}
</style>