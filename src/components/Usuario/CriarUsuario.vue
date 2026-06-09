<script setup lang="ts">
import { useEmpresa } from '@/api/composables/useEmpresa'
import { useCreateUsuario } from '@/api/composables/useUsuario'
import { reactive, ref } from 'vue'
import Primeiro from '../Primeiro.vue'

const usuarioMutation = useCreateUsuario()
const abrirSite = ref(false)
const form = reactive({
    nome: '',
    login: '',
    email: '',
    senha: '',
    empresa: null as any,
})

function enviar() {
    usuarioMutation.mutate(
        { ...form },
        {
            onSuccess: () => {
                abrirSite.value = true
            }
        }
    )
}

function limpar() {
    form.nome = ''
    form.login = ''
    form.email = ''
    form.senha = ''
}

</script>

<template>
    <div v-if="abrirSite == false" class="card-modal">
        <div class="titulo">Cadastrar Usuário</div>

        <form @submit.prevent="enviar">
            <div class="inputs">

                <v-text-field v-model="form.nome" label="Seu nome..." variant="outlined" density="compact"
                    prepend-inner-icon="mdi-account" />


                <v-text-field v-model="form.login" label="Login..." variant="outlined" density="compact"
                    prepend-inner-icon="mdi-login" />


                <v-text-field v-model="form.email" label="E-mail..." variant="outlined" density="compact"
                    prepend-inner-icon="mdi-at" />

                <v-text-field v-model="form.senha" label="Senha..." variant="outlined" density="compact"
                    prepend-inner-icon="mdi-lock" />

            </div>

            <div class="botoes">
                <v-btn variant="text" color="#EB3939" @click="limpar">
                    Cancelar
                </v-btn>

                <v-btn type="submit" variant="text" color="#00995C" :loading="usuarioMutation.isPending.value">
                    Salvar
                </v-btn>
            </div>
        </form>
    </div>
    <div v-else>
        <Primeiro/>
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