<script setup lang="ts">
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
                router.replace('/home')
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
    <div v-if="!abrirSite" class="login-page">

        <div class="login-card">

            <div class="login-header">

                <div class="logo">
                    <v-icon size="34" color="white">
                        mdi-shield-check
                    </v-icon>
                </div>

                <h1>ConformISO</h1>

                <p>
                    Sistema de Diagnóstico de Conformidade<br>
                    ISO 27001 e ISO 27701
                </p>

            </div>

            <form @submit.prevent="enviar">

                <v-text-field v-model="form.login" label="Login" prepend-inner-icon="mdi-account-outline"
                    variant="outlined" density="comfortable" />

                <v-text-field v-model="form.senha" label="Senha" prepend-inner-icon="mdi-lock-outline" type="password"
                    variant="outlined" density="comfortable" />

                <RouterLink class="cadastro-link" to="/cadastro">
                    Não possui uma conta? Cadastre-se
                </RouterLink>

                <div class="acoes">

                    <v-btn variant="outlined" @click="limpar">
                        Limpar
                    </v-btn>

                    <v-btn color="primary" type="submit" :loading="usuarioMutation.isPending.value">
                        Entrar
                    </v-btn>

                </div>

            </form>

        </div>

    </div>

    <Primeiro v-else :usuario="usuario" @logout="onLogout" />
</template>

<style scoped>
.login-page{
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:#f8fafc;
    padding:24px;
}

.login-card{
    width:430px;
    background:white;
    border-radius:24px;
    padding:40px;

    box-shadow:
        0 10px 25px rgba(15,23,42,.08),
        0 4px 8px rgba(15,23,42,.04);
}

.login-header{
    text-align:center;
    margin-bottom:32px;
}

.logo{
    width:72px;
    height:72px;

    margin:auto;
    margin-bottom:18px;

    border-radius:18px;

    background:#142850;

    display:flex;
    align-items:center;
    justify-content:center;
}

.login-header h1{
    font-size:32px;
    color:#142850;
    font-weight:700;
    margin-bottom:10px;
}

.login-header p{
    color:#64748b;
    line-height:1.6;
}

.acoes{
    display:flex;
    justify-content:flex-end;
    gap:12px;
    margin-top:24px;
}

.cadastro-link{
    display:block;
    margin-top:10px;
    text-align:right;

    color:#2563eb;
    text-decoration:none;
    font-size:.9rem;
}

.cadastro-link:hover{
    text-decoration:underline;
}

:deep(.v-field){
    border-radius:12px;
}

:deep(.v-btn){
    border-radius:10px;
    font-weight:600;
    text-transform:none;
}
</style>