<script setup lang="ts">
import { useEmpresa } from '@/api/composables/useEmpresa'
import useModulo from '@/api/composables/useModulo'
import { reactive, ref } from 'vue'
import Escolha from './Escolha.vue'
import type { Usuario } from '@/types/usuario.ts'
import Dashbord from './Dashbord.vue'
import { logoutUsuario } from '@/api/composables/useUsuario'

const criarEmpresa = useEmpresa()
const modulosMutation = useModulo()

const abrirModulos = ref(false)
const empresaCriada = ref<number>(0)

const abrirDash = ref(false)

const emit = defineEmits(['logout'])

const props = defineProps<{
  usuario: Usuario
}>()

const form = reactive({
  idEmpresa: 0,
  nome: '',
  cnpj: '',
  nome_user: '',
  resposta: [],
  id_usuario: props.usuario.id_usuario
})

function enviar() {
  criarEmpresa.mutate(
    { ...form },
    {
      onSuccess: (response) => {
        console.log(response)

        empresaCriada.value = response.data.idEmpresa
        abrirModulos.value = true
      }
    }
  )
}

function selecionarEmpresa(idEmpresa: number) {
  abrirModulos.value = true
  empresaCriada.value = idEmpresa
}

function selecionarEmpresaDash(idEmpresa: number) {
  abrirDash.value = true
  empresaCriada.value = idEmpresa
  console.log(abrirDash.value)

}

function logout() {
  logoutUsuario()
  emit('logout')
}

function limpar() {
  form.nome = ''
  form.cnpj = ''
  form.nome_user = ''
  form.resposta = []
}

</script>

<template>
  <div v-if="!abrirModulos && !abrirDash" class="container">
    <div class="card-modal">

      <div class="header">
        <v-icon size="32" color="primary">mdi-domain-plus</v-icon>
        <div>
          <h2>Nova Empresa</h2>
          <p>Cadastre uma nova empresa ou selecione uma existente.</p>
        </div>
        <v-btn color="error" variant="text" class="logout-button" @click="logout">
          Sair
        </v-btn>
      </div>

      <v-divider class="my-4" />

      <form @submit.prevent="enviar">
        <div class="inputs">
          <v-text-field
            v-model="form.nome"
            label="Nome da empresa"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-domain"
          />

          <v-text-field
            v-model="form.nome_user"
            label="Seu nome"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-account"
          />

          <v-text-field
            v-model="form.cnpj"
            label="CNPJ"
            placeholder="12.345.678/0001-99"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-card-account-details"
          />
        </div>

        <div class="botoes">
          <v-btn
            variant="outlined"
            color="error"
            @click="limpar"
          >
            Cancelar
          </v-btn>

          <v-btn
            type="submit"
            color="primary"
            :loading="criarEmpresa.isPending.value"
          >
            Salvar Empresa
          </v-btn>
        </div>
      </form>

      <v-divider class="my-6" />

      <div class="empresas-section">
        <h3>Empresas Vinculadas</h3>

        <div
          v-for="empresa in usuario.empresas"
          :key="empresa.idEmpresa"
          class="empresa-card"
        >
          <div class="empresa-info">
            <v-icon color="primary">mdi-office-building</v-icon>

            <div>
              <strong>{{ empresa.nome }}</strong>
              <span>{{ empresa.cnpj }}</span>
            </div>
          </div>

          <v-btn
            color="primary"
            variant="tonal"
            @click="selecionarEmpresa(empresa.idEmpresa)"
          >
            Responder questionário
          </v-btn>

           <v-btn
            color="primary"
            variant="tonal"
            @click="selecionarEmpresaDash(empresa.idEmpresa)"
            
          >
            Dashboard
          </v-btn>
        </div>
      </div>

    </div>
  </div>

  <div v-else-if="abrirModulos">
    <Escolha
      :modulosMutation="modulosMutation"
      :empresaCriada="empresaCriada"
    />
  </div>

  <div v-else>
    <Dashbord :empresaCriada="empresaCriada" />
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  padding: 24px;
}

.card-modal {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.04);
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header h2 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e293b;
}

.header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.95rem;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.botoes {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.empresas-section h3 {
  margin-bottom: 16px;
  color: #334155;
  font-size: 1.1rem;
}

.empresas-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empresa-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  transition: all 0.2s ease;
  background: #fff;
}

.empresa-card:hover {
  border-color: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(25, 118, 210, 0.12);
}

.empresa-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.empresa-info div {
  display: flex;
  flex-direction: column;
}

.empresa-info strong {
  color: #1e293b;
  font-size: 15px;
}

.empresa-info span {
  color: #64748b;
  font-size: 13px;
}

@media (max-width: 768px) {
  .card-modal {
    padding: 20px;
  }

  .empresa-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .botoes {
    flex-direction: column;
  }

  .botoes .v-btn {
    width: 100%;
  }
}
</style>