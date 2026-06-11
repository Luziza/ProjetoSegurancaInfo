import { useQueryClient, useMutation } from "@tanstack/vue-query";
import useToast from "./userToast";
import type { EmpresaResponse } from "@/types/empresa";
import empresaService from "../services/empresa.service";
import respostaService from "../services/resposta.service";
import type { Resposta } from "@/types/resposta";
import usuarioService from "../services/usuario.service";
import type { Usuario, UsuarioLogin } from "@/types/usuario";


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

export function useLoginUsuario(onFinish?: () => void) {
  const queryClient = useQueryClient()
  const { show } = useToast()

  return useMutation({
    mutationFn: (usuarioLogin: UsuarioLogin) =>
      usuarioService.loginUsuario(usuarioLogin),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['respostas'] })

      console.log(data) // resposta do backend

      show('Login realizado com sucesso!', 'info')

      if (onFinish) onFinish()
    },

    onError: () => {
      show('Erro ao realizar login', 'error')
    }
  })
}