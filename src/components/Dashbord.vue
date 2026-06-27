<script setup lang="ts">
import { computed } from 'vue'
import useAvaliacao from '@/api/composables/useAvaliacao'
import type { AvaliacaoResponse } from '@/types/avaliacao'
import AvaliacaoGrafico from '@/components/AvaliacaoGrafico.vue'
import { useRouter } from 'vuetify/lib/composables/router.mjs';
import { logoutUsuario } from '@/api/composables/useUsuario';
import router from '@/routers';

const props = defineProps<{
    empresaCriada: number
}>()

const route = useRouter()
function logout() {
  logoutUsuario()
  localStorage.removeItem('authUser')
  router.push('/login')
}
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

// --- Listas completas (usadas para os cálculos de média) ---
const listaCompleta = computed(() => avaliacaoQuery.data.value ?? [])

const todasModulo1 = computed(() =>
    listaCompleta.value.filter(a => a.tipo_pergunta === 1)
)

const todasModulo2 = computed(() =>
    listaCompleta.value.filter(a => a.tipo_pergunta === 2)
)

// --- Listas limitadas (usadas apenas para exibição dos cards/gráficos dos módulos) ---
const avaliacoesModulo1 = computed(() =>
    [...todasModulo1.value]
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 3)
)

const avaliacoesModulo2 = computed(() =>
    [...todasModulo2.value]
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 3)
)

// Usada só para checar se existe ALGUMA avaliação (estado vazio/loading)
const ultimasAvaliacoes = computed(() =>
    [...listaCompleta.value]
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 3)
)

// --- Médias: calculadas sobre a lista COMPLETA, não sobre os itens exibidos ---
const mediaModulo1 = computed(() => calcularMedia(todasModulo1.value))
const mediaModulo2 = computed(() => calcularMedia(todasModulo2.value))
const mediaGeral = computed(() => calcularMedia(listaCompleta.value))

// --- Card "Geral": combina a avaliação mais recente do Módulo 1 + Módulo 2 em UM único gráfico ---
const ultimaModulo1 = computed(() => avaliacoesModulo1.value[0] ?? null)
const ultimaModulo2 = computed(() => avaliacoesModulo2.value[0] ?? null)

const avaliacaoCombinadaGeral = computed<AvaliacaoResponse | null>(() => {
    const a1 = ultimaModulo1.value
    const a2 = ultimaModulo2.value

    if (!a1 && !a2) return null

    const respostas = [
        ...(a1?.respostas ?? []),
        ...(a2?.respostas ?? []),
    ]

    const dataMaisRecente = [a1, a2]
        .filter((a): a is AvaliacaoResponse => a !== null)
        .reduce(
            (max, a) => Math.max(max, new Date(a.data).getTime()),
            0
        )

    // NOTE: ajuste os campos abaixo se o tipo AvaliacaoResponse exigir mais propriedades
    return {
        ...(a1 ?? a2),
        id_avaliacao: -1,
        data: new Date(dataMaisRecente),
        respostas,
    } as AvaliacaoResponse
})
</script>

<template>
    <div class="page">
        <!-- Navbar -->

        <header class="navbar">
            <div class="navbar-brand">
                <span class="brand-icon">
                    <v-icon size="20" color="white">mdi-shield-check</v-icon>
                </span>

                <span class="brand-name">ConformISO</span>
            </div>

            <nav class="navbar-links">
                <RouterLink to="/home" class="nav-link">
                    <v-icon size="18">mdi-home-outline</v-icon>
                    Home
                </RouterLink>
            </nav>

            <v-btn variant="text" class="logout-button" prepend-icon="mdi-logout-variant" @click="logout">
                Sair
            </v-btn>
        </header>

        <!-- Content -->
        <main class="content">
            <div class="content-header">
                <div>
                    <h1>Dashboard de conformidade</h1>
                    <p>Acompanhe os resultados das avaliações de ISO 27002 e 27701.</p>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="avaliacaoQuery.isLoading.value" class="card-area">
                <div class="empty-state">
                    <span class="empty-icon">
                        <v-icon size="36" color="primary">mdi-progress-clock</v-icon>
                    </span>
                    <h3>Carregando avaliações</h3>
                    <p>Aguarde enquanto buscamos os dados mais recentes.</p>
                </div>
            </div>

            <!-- Empty -->
            <div v-else-if="ultimasAvaliacoes.length === 0" class="card-area">
                <div class="empty-state">
                    <span class="empty-icon">
                        <v-icon size="36" color="primary">mdi-chart-box-outline</v-icon>
                    </span>
                    <h3>Nenhuma avaliação encontrada</h3>
                    <p>Responda um questionário para começar a acompanhar a conformidade.</p>
                </div>
            </div>

            <!-- Módulos -->
            <template v-else>
                <section class="modulo-card">
                    <div class="modulo-header">
                        <h2>Módulo 1</h2>
                        <span class="media-badge">{{ mediaModulo1 }}% de conformidade</span>
                    </div>

                    <v-row>
                        <v-col v-for="avaliacao in avaliacoesModulo1" :key="avaliacao.id_avaliacao" cols="12" md="4">
                            <AvaliacaoGrafico :avaliacao="avaliacao" />
                        </v-col>
                    </v-row>
                </section>

                <section class="modulo-card">
                    <div class="modulo-header">
                        <h2>Módulo 2</h2>
                        <span class="media-badge">{{ mediaModulo2 }}% de conformidade</span>
                    </div>

                    <v-row>
                        <v-col v-for="avaliacao in avaliacoesModulo2" :key="avaliacao.id_avaliacao" cols="12" md="4">
                            <AvaliacaoGrafico :avaliacao="avaliacao" />
                        </v-col>
                    </v-row>
                </section>

                <section class="modulo-card">
                    <div class="modulo-header">
                        <h2>Geral</h2>
                        <span class="media-badge">{{ mediaGeral }}% de conformidade</span>
                    </div>

                    <v-row v-if="avaliacaoCombinadaGeral" justify="center">
                        <v-col cols="12" md="6">
                            <AvaliacaoGrafico :avaliacao="avaliacaoCombinadaGeral" />
                        </v-col>
                    </v-row>
                </section>
            </template>
        </main>
    </div>
</template>

<style scoped>
.page {
    min-height: 100vh;
    background: #f5f7fa;
}

/* Navbar */
.navbar {
    display: flex;
    align-items: center;
    gap: 32px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    padding: 14px 32px;
}

.navbar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 1.05rem;
    color: #142850;
}

.brand-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #142850;
    display: flex;
    align-items: center;
    justify-content: center;
}

.navbar-links {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 6px;
    border: none;
    background: transparent;
    color: #64748b;
    font-size: 0.92rem;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
}

.nav-link:hover {
    background: #f1f5f9;
    color: #142850;
}

.nav-link.active {
    background: #e8f1fc;
    color: #142850;
}

.logout-button {
    color: #64748b !important;
}

/* Content */
.content {
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 32px;
}

.content-header {
    margin-bottom: 28px;
}

.content-header h1 {
    margin: 0 0 6px;
    font-size: 1.9rem;
    font-weight: 800;
    color: #1e293b;
}

.content-header p {
    margin: 0;
    color: #64748b;
    font-size: 0.98rem;
}

/* Generic card area (loading / empty states) */
.card-area {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    padding: 32px;
    min-height: 320px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 56px 24px;
    gap: 6px;
}

.empty-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #e8f1fc;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
}

.empty-state h3 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 700;
    color: #1e293b;
}

.empty-state p {
    margin: 0;
    color: #64748b;
    font-size: 0.95rem;
}

/* Módulo cards */
.modulo-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    padding: 28px 28px 12px;
    margin-bottom: 24px;
}

.modulo-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
}

.modulo-header h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: #1e293b;
}

.media-badge {
    background: #e8f1fc;
    color: #142850;
    font-weight: 700;
    font-size: 0.85rem;
    padding: 6px 14px;
    border-radius: 999px;
}

@media (max-width: 768px) {
    .navbar {
        flex-wrap: wrap;
        gap: 12px;
    }

    .navbar-links {
        order: 3;
        width: 100%;
        overflow-x: auto;
    }

    .content {
        padding: 24px 16px;
    }

    .modulo-card {
        padding: 20px 16px 8px;
    }
}
</style>