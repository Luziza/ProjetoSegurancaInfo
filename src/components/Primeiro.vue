<script setup lang="ts">
import { useEmpresaCadastro, useEmpresaDeletar } from '@/api/composables/useEmpresa'
import useModulo from '@/api/composables/useModulo'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Escolha from './Escolha.vue'
import type { Usuario } from '@/types/usuario.ts'
import { logoutUsuario } from '@/api/composables/useUsuario'

const criarEmpresa = useEmpresaCadastro()
const deletarEmpresaMutation = useEmpresaDeletar()
const modulosMutation = useModulo()
const abrirEscolha = ref(false)

const abrirModulos = ref(false)
const empresaCriada = ref<number>(0)

const emit = defineEmits(['logout'])
const router = useRouter()

const props = defineProps<{
  usuario?: Usuario
}>()

function carregarUsuarioInicial(): Usuario {
  if (props.usuario) {
    return props.usuario
  }

  const saved = localStorage.getItem('authUser')
  if (saved) {
    try {
      return JSON.parse(saved) as Usuario
    } catch {
      // fallback abaixo
    }
  }

  return {
    idUsuario: 0,
    nome: '',
    email: '',
    senha: '',
    empresas: []
  }
}

const usuario = ref<Usuario>(carregarUsuarioInicial())

const form = reactive({
  nome: '',
  cnpj: '',
  idUsuario: usuario.value.idUsuario
})

function enviar() {
  criarEmpresa.mutate(
    { ...form },
    {
      onSuccess: (response) => {
        const novaEmpresa = response.data

        empresaCriada.value = novaEmpresa.idEmpresa

        usuario.value.empresas.push(novaEmpresa)
        localStorage.setItem('authUser', JSON.stringify(usuario.value))

        limpar()
      }
    }
  )
}

function selecionarEmpresa(idEmpresa: number) {
  empresaCriada.value = idEmpresa
  abrirEscolha.value = true
}

function selecionarEmpresaDash(idEmpresa: number) {
  empresaCriada.value = idEmpresa
  router.push({ name: 'dashboard', query: { empresaCriada: String(idEmpresa) } })
}

function logout() {
  logoutUsuario()
  localStorage.removeItem('authUser')
  router.push({ name: 'login' })
  emit('logout')
}

function limpar() {
  form.nome = ''
  form.cnpj = ''
}

function confirmarExclusao(idEmpresa: number, nomeEmpresa: string) {
  if (!confirm(`Tem certeza que deseja excluir "${nomeEmpresa}"? Essa ação apaga também as avaliações e respostas vinculadas.`)) {
    return
  }

  deletarEmpresaMutation.mutate(idEmpresa, {
    onSuccess: () => {
      usuario.value.empresas = usuario.value.empresas.filter(
        (e) => e.idEmpresa !== idEmpresa
      )
      localStorage.setItem('authUser', JSON.stringify(usuario.value))
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        alert('Não foi possível excluir esta empresa.')
      } else {
        alert('Erro ao excluir empresa. Tente novamente.')
      }
    }
  })
}
</script>

<template>
  <div v-if="!abrirModulos" class="page">

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

    <!-- CONTEÚDO -->
    <main class="content">

      <div class="page-header">
        <div>
          <h1>Empresas cadastradas</h1>
          <p>
            Avalie a conformidade com ISO 27001 e acompanhe seus resultados.
          </p>
        </div>
      </div>

      <!-- FORMULÁRIO -->
      <v-card class="mb-6" rounded="xl">
        <v-card-title>
          Cadastro de Empresa
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field v-model="form.nome" label="Empresa" variant="outlined" />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field v-model="form.cnpj" label="CNPJ" variant="outlined" />
            </v-col>
          </v-row>

          <div class="actions">
            <v-btn variant="outlined" @click="limpar">
              Limpar
            </v-btn>

            <v-btn color="primary" @click="enviar" :loading="criarEmpresa.isPending.value">
              Salvar
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- EMPRESAS -->
      <v-card rounded="xl">

        <template v-if="usuario.empresas.length">

          <v-list>

            <v-list-item v-for="empresa in usuario.empresas" :key="empresa.idEmpresa" class="empresa-item">
              <template #prepend>
                <v-avatar color="primary" size="40">
                  <v-icon>mdi-domain</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title>
                {{ empresa.nome }}
              </v-list-item-title>

              <v-list-item-subtitle>
                {{ empresa.cnpj }}
              </v-list-item-subtitle>

              <template #append>

                <v-btn color="primary" variant="tonal" class="mr-2" @click="selecionarEmpresa(empresa.idEmpresa)">
                  Questionário
                </v-btn>

                <v-btn color="primary" class="mr-2" @click="selecionarEmpresaDash(empresa.idEmpresa)">
                  Dashboard
                </v-btn>

                <v-btn
                  icon="mdi-delete-outline"
                  color="error"
                  variant="text"
                  :loading="deletarEmpresaMutation.isPending.value"
                  @click="confirmarExclusao(empresa.idEmpresa, empresa.nome)"
                />

              </template>

            </v-list-item>

          </v-list>

        </template>

        <template v-else>

          <div class="empty-state">

            <div class="empty-icon">
              <v-icon size="48">
                mdi-office-building-outline
              </v-icon>
            </div>

            <h2>Nenhuma empresa cadastrada</h2>

            <p>
              Cadastre sua primeira empresa para começar a avaliação.
            </p>

          </div>

        </template>

      </v-card>

    </main>
  </div>

  <v-dialog v-model="abrirEscolha">
    <v-card class="d-flex align-center justify-center pa-4">
      <Escolha :modulosMutation="modulosMutation" :empresaCriada="empresaCriada" @fechar="abrirEscolha = false" />
    </v-card>
  </v-dialog>

</template>

<style scoped>
.escolha {
  height: 100px;
  width: 100px;
}

.page {
  min-height: 100vh;
  background: #f8fafc;
}

.topbar {
  height: 72px;
  background: white;
  border-bottom: 1px solid #e2e8f0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;

  font-size: 20px;
  font-weight: 700;
}

.menu {
  display: flex;
  gap: 16px;
}

.content {
  max-width: 1300px;
  margin: auto;
  padding: 32px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 42px;
  font-weight: 700;
  color: #0f172a;
}

.page-header p {
  color: #64748b;
  margin-top: 8px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.empty-state {
  min-height: 350px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
  gap: 16px;
}

.empty-icon {
  width: 80px;
  height: 80px;

  border-radius: 50%;
  background: #dbeafe;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #1d4ed8;
}

.empresa-item {
  padding: 16px !important;
}

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
</style>