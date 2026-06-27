<script setup lang="ts">
import { useCreateUsuario } from '@/api/composables/useUsuario'
import { reactive, ref } from 'vue'
import Primeiro from '../Primeiro.vue'
import { useRouter } from 'vuetify/lib/composables/router.mjs'
import router from '@/routers/index.ts'

const usuarioMutation = useCreateUsuario()
const abrirSite = ref(false)
const route = useRouter()
const form = reactive({
    nome: '',
    login: '',
    email: '',
    senha: '',
    empresas: [],
})

function enviar() {
    usuarioMutation.mutate(
        { ...form },
        {
            onSuccess: () => {
                limpar()
                router.push('/home')
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
    <div class="page">
        <div class="card">

            <!-- HEADER -->
            <div class="header">
                <div class="logo">
                    <v-icon size="40" color="#0B1F44">mdi-shield-check</v-icon>
                </div>

                <div class="titulo">Cadastrar Usuário</div>
                <div class="subtitulo">Sistema de Diagnóstico de Conformidade</div>
            </div>

            <!-- FORM -->
            <form @submit.prevent="enviar" class="form">

                <v-text-field v-model="form.nome" label="Seu nome" variant="outlined" density="compact"
                    prepend-inner-icon="mdi-account" />

                <v-text-field v-model="form.login" label="Login" variant="outlined" density="compact"
                    prepend-inner-icon="mdi-login" />

                <v-text-field v-model="form.email" label="E-mail" variant="outlined" density="compact"
                    prepend-inner-icon="mdi-at" />

                <v-text-field v-model="form.senha" label="Senha" type="password" variant="outlined" density="compact"
                    prepend-inner-icon="mdi-lock" />

                <!-- LINK -->
                <RouterLink to="/home" class="link">
                    <v-icon size="18">mdi-home-outline</v-icon>
                    Já possui conta? Entrar.
                </RouterLink>


                <!-- BOTÕES -->
                <div class="botoes">
                    <v-btn variant="text" color="#EB3939" @click="limpar">
                        Limpar
                    </v-btn>

                    <v-btn type="submit" color="#0B5ED7" :loading="usuarioMutation.isPending.value">
                        Salvar
                    </v-btn>
                </div>

            </form>
        </div>
    </div>
</template>

<style scoped>
.page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f4f6fb;
}

.card {
    width: 100%;
    max-width: 420px;
    background: #fff;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.header {
    text-align: center;
    margin-bottom: 24px;
}

.logo {
    margin-bottom: 10px;
}

.titulo {
    font-size: 22px;
    font-weight: 700;
    color: #0b1f44;
}

.subtitulo {
    font-size: 13px;
    color: #6b7280;
    margin-top: 4px;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.link {
    text-align: center;
    font-size: 13px;
    margin-top: 6px;
}

.link a {
    color: #0b5ed7;
    text-decoration: none;
    font-weight: 500;
}

.botoes {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 16px;
}
</style>