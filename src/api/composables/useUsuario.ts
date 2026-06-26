import { useQueryClient, useMutation } from "@tanstack/vue-query";
import useToast from "./userToast";
import type { AxiosResponse } from "axios";
import type { EmpresaResponse } from "@/types/empresa";
import empresaService from "../services/empresa.service";
import respostaService from "../services/resposta.service";
import type { Resposta } from "@/types/resposta";
import usuarioService from "../services/usuario.service";
import { setAuthToken } from "../services/http/axios";
import type { Usuario, UsuarioLogin, UsuarioToken } from "@/types/usuario";


export function useCreateUsuario(onFinish?: () => void) {
  const queryClient = useQueryClient()
  const { show } = useToast()

  return useMutation({
    mutationFn: (usuario: Usuario) => usuarioService.cadastrarUsuario(usuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['respostas'] })
      show('Usuário criado com sucesso!', 'info')

      if (onFinish) onFinish()
    },
    onError: () => {
      show('Erro ao criar usuário', 'error')
    }
  })
}
export function logoutUsuario() {
  setAuthToken(null)
  localStorage.removeItem('authUser')
}
export function useLoginUsuario(onFinish?: () => void) {
  const queryClient = useQueryClient()
  const { show } = useToast()

  return useMutation<AxiosResponse<UsuarioToken>, unknown, UsuarioLogin>({
    mutationFn: (usuarioLogin: UsuarioLogin) =>
      usuarioService.loginUsuario(usuarioLogin),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['respostas'] })

      console.log(data) // resposta do backend

      if (data.data?.token) {
        setAuthToken(data.data.token)
      }

      if (data.data?.usuario) {
        localStorage.setItem('authUser', JSON.stringify(data.data.usuario))
      }

      show('Login realizado com sucesso!', 'info')

      if (onFinish) onFinish()
    },

    onError: () => {
      show('Erro ao realizar login', 'error')
    }
  })
}