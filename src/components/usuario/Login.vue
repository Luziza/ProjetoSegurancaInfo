<script setup lang="ts">
import { useEmpresa } from '@/api/composables/useEmpresa'
import useModulo from '@/api/composables/useModulo'
import { useCreateUsuario, useLoginUsuario } from '@/api/composables/useUsuario'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Primeiro from '../Primeiro.vue'
import type { Usuario } from '@/types/usuario.ts'

const router = useRouter()
const usuarioMutation = useLoginUsuario()
const abrirSite = ref(false)
const form = reactive({
    login: '',
    senha: ''
})
const usuario = ref<Usuario>({} as Usuario)


function enviar() {
  usuarioMutation.mutate(
    { ...form },
    {
      onSuccess: (response) => {
        console.log(response)

        usuario.value = response.data.usuario
        abrirSite.value = true
        router.push('/home')
      }
    }
  )
}

function limpar() {
    form.login = ''
    form.senha = ''
}

function onLogout() {
    abrirSite.value = false
    usuario.value = {} as Usuario
    limpar()
}

</script>

<template>
    <div v-if="!abrirSite" class="login-container">
        <div class="card-modal">

            <div class="logo">
                <h1>PSI</h1>
                <p>Sistema de Diagnóstico ISO 27001 / 27701</p>
            </div>

            <div class="titulo">Entrar</div>

            <form @submit.prevent="enviar">
                <div class="inputs">

                    <v-text-field
                        v-model="form.login"
                        label="Login"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-account"
                    />

                    <v-text-field
                        v-model="form.senha"
                        label="Senha"
                        type="password"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-lock"
                    />

                </div>
                <router-link to="/cadastro">Não possui cadastro?</router-link>
                <div class="botoes">
                    <v-btn
                        variant="outlined"
                        color="error"
                        @click="limpar"
                    >
                        Limpar
                    </v-btn>

                    <v-btn
                        type="submit"
                        color="success"
                        :loading="usuarioMutation.isPending.value"
                    >
                        Entrar
                    </v-btn>
                </div>
            </form>

        </div>
    </div>

    <div v-else>
        <Primeiro :usuario="usuario" @logout="onLogout" />
    </div>
</template>

<style scoped>
.card-modal {
    width: 420px;
    padding: 32px;
    border-radius: 20px;
    background: white;
    box-shadow:
        0 10px 25px rgba(0, 0, 0, 0.08),
        0 4px 10px rgba(0, 0, 0, 0.05);
}

.titulo {
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    color: #1f2937;
    margin-bottom: 25px;
}

.inputs {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.botoes {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
}

.login-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(
        135deg,
        #00995c 0%,
        #00b86b 50%,
        #00d67d 100%
    );
    padding: 20px;
}

.logo {
    text-align: center;
    margin-bottom: 24px;
}

.logo h1 {
    color: #00995c;
    font-size: 32px;
    font-weight: bold;
    margin: 0;
}

.logo p {
    color: #6b7280;
    margin-top: 8px;
    font-size: 14px;
}

:deep(.v-btn) {
    border-radius: 10px;
    font-weight: 600;
}

:deep(.v-field) {
    border-radius: 12px;
}
</style>