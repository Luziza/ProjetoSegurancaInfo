<script setup lang="ts">
import { useEmpresa } from '@/api/composables/useEmpresa'
import useModulo from '@/api/composables/useModulo'
import { reactive, ref } from 'vue'
import Escolha from './Escolha.vue'

const criarEmpresa = useEmpresa()
const modulosMutation = useModulo()

const abrirModulos = ref(false)


const form = reactive({
  nome: '',
  cnpj: '',
  criado_em: '',
  nome_user: ''
})

function enviar() {
  criarEmpresa.mutate({ ...form })
  abrirModulos.value = true
}

function limpar() {
  form.nome = ''
  form.cnpj = ''
  form.nome_user = ''
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
  </div>
  <div v-else>
    <Escolha :modulosMutation="modulosMutation" />
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