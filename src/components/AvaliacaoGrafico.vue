<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
} from 'chart.js'
import type { AvaliacaoResponse } from '@/types/avaliacao'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

const props = defineProps<{
    avaliacao: AvaliacaoResponse
}>()

const contagem = computed(() => {
    const counts = { sim: 0, nao: 0, em_andamento: 0, nao_aplica: 0 }

    for (const r of props.avaliacao.respostas) {
        if (r.sim) counts.sim++
        else if (r.nao) counts.nao++
        else if (r.em_andamento) counts.em_andamento++
        else if (r.nao_aplica) counts.nao_aplica++
    }

    return counts
})

// % de conformidade: sim / (sim + nao), ignorando nao_aplica e em_andamento
const conformidade = computed(() => {
    const respostasValidas = props.avaliacao.respostas.filter(
        r => !r.nao_aplica && !r.em_andamento
    )

    if (respostasValidas.length === 0) return 0

    const conformes = respostasValidas.filter(r => r.sim).length

    return Number(((conformes / respostasValidas.length) * 100).toFixed(1))
})

const corConformidade = computed(() => {
    if (conformidade.value >= 80) return 'success'
    if (conformidade.value >= 50) return 'warning'
    return 'error'
})

const chartData = computed(() => ({
    labels: ['Sim', 'Não', 'Em andamento', 'Não se aplica'],
    datasets: [
        {
            backgroundColor: ['#4CAF50', '#F44336', '#FFC107', '#9E9E9E'],
            data: [
                contagem.value.sim,
                contagem.value.nao,
                contagem.value.em_andamento,
                contagem.value.nao_aplica,
            ],
        },
    ],
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: { position: 'bottom' as const },
        tooltip: {
            callbacks: {
                label: (ctx: any) => {
                    const total = ctx.dataset.data.reduce(
                        (a: number, b: number) => a + b,
                        0
                    )
                    const valor = ctx.raw as number
                    const pct = total > 0 ? ((valor / total) * 100).toFixed(1) : 0
                    return `${ctx.label}: ${valor} (${pct}%)`
                },
            },
        },
    },
}
</script>

<template>
    <v-card>
        <v-card-title class="text-subtitle-1 d-flex justify-space-between align-center">
            <span>{{ new Date(avaliacao.data).toLocaleDateString('pt-BR') }}</span>

            <v-chip :color="corConformidade" variant="flat" size="small">
                {{ conformidade }}% conforme
            </v-chip>
        </v-card-title>

        <v-card-text>
            <Pie :data="chartData" :options="chartOptions" />
        </v-card-text>
    </v-card>
</template>