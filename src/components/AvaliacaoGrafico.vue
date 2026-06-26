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

const statusConformidade = computed(() => {
    if (conformidade.value >= 80) return 'alta'
    if (conformidade.value >= 50) return 'media'
    return 'baixa'
})

const dataFormatada = computed(() =>
    new Date(props.avaliacao.data).toLocaleDateString('pt-BR')
)

const chartData = computed(() => ({
    labels: ['Sim', 'Não', 'Em andamento', 'Não se aplica'],
    datasets: [
        {
            backgroundColor: ['#22a35d', '#e5484d', '#f0a93a', '#94a3b8'],
            borderWidth: 0,
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
        legend: {
            position: 'bottom' as const,
            labels: {
                boxWidth: 10,
                boxHeight: 10,
                padding: 12,
                font: { size: 11 },
                color: '#64748b',
            },
        },
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
    <div class="avaliacao-card">
        <div class="avaliacao-header">
            <span class="avaliacao-data">
                <v-icon size="16" color="#64748b">mdi-calendar-blank-outline</v-icon>
                {{ dataFormatada }}
            </span>

            <span class="conformidade-badge" :class="statusConformidade">
                {{ conformidade }}% conforme
            </span>
        </div>

        <div class="avaliacao-chart">
            <Pie :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<style scoped>
.avaliacao-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 18px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.avaliacao-card:hover {
    box-shadow: 0 6px 18px rgba(20, 40, 80, 0.08);
    transform: translateY(-2px);
}

.avaliacao-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.avaliacao-data {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #475569;
    font-size: 0.85rem;
    font-weight: 500;
}

.conformidade-badge {
    font-size: 0.78rem;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 999px;
    white-space: nowrap;
}

.conformidade-badge.alta {
    background: #e3f6ea;
    color: #1e8a4c;
}

.conformidade-badge.media {
    background: #fdf1dc;
    color: #b3760f;
}

.conformidade-badge.baixa {
    background: #fbe7e7;
    color: #c5333a;
}

.avaliacao-chart {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>