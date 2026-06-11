<script setup lang="ts">
import { useEmpresa } from '@/api/composables/useEmpresa'
import useModulo from '@/api/composables/useModulo'
import { reactive, ref } from 'vue'
import Escolha from './Escolha.vue'
import type { Usuario } from '@/types/usuario.ts'

const criarEmpresa = useEmpresa()
const modulosMutation = useModulo()

const abrirModulos = ref(false)
const empresaCriada = ref<number>(0)

const props = defineProps<{
  usuario: Usuario
}>()

const form = reactive({
  id_empresa: 0,
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

        empresaCriada.value = response.data.id_empresa
        abrirModulos.value = true
      }
    }
  )
}

function selecionarEmpresa(id_empresa: number) {
  abrirModulos.value = true
  empresaCriada.value = id_empresa
  console.log(empresaCriada.value)
}

function limpar() {
  form.nome = ''
  form.cnpj = ''
  form.nome_user = ''
  form.resposta = []
}

</script>

<template>
  <div v-if="abrirModulos == false" class="card-modal">
    <div class="titulo">Nova Empresa</div>

    <form @submit.prevent="enviar">
      <div class="inputs">

        <v-text-field v-model="form.nome" label="Nome da empresa" variant="outlined" density="compact"
          prepend-inner-icon="mdi-domain" />


        <v-text-field v-model="form.nome_user" label="Seu nome..." variant="outlined" density="compact"
          prepend-inner-icon="mdi-domain" />


        <v-text-field v-model="form.cnpj" label="CNPJ" placeholder="12.345.678/0001-99" variant="outlined"
          density="compact" prepend-inner-icon="mdi-card-account-details" />

      </div>

      <div class="botoes">
        <v-btn variant="text" color="#EB3939" @click="limpar">
          Cancelar
        </v-btn>

        <v-btn type="submit" variant="text" color="#00995C" :loading="criarEmpresa.isPending.value">
          Salvar
        </v-btn>
      </div>
    </form>
    <div v-for="empresa in usuario.empresas" :key="empresa.id_empresa">
      <h3>{{ empresa.nome }}</h3>
      <p>CNPJ: {{ empresa.cnpj }}</p>
      <v-btn @click="selecionarEmpresa(empresa.id_empresa)">Selecionar empresa</v-btn>
    </div>
  </div>
  <div v-else>
    <Escolha :modulosMutation="modulosMutation" :empresaCriada="empresaCriada" />
  </div>
</template>

<style scoped>
.titulo {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.botoes {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>