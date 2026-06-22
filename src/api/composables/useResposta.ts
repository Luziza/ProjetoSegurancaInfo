import { useQueryClient, useMutation } from "@tanstack/vue-query";
import useToast from "./userToast";
import type { EmpresaResponse } from "@/types/empresa";
import empresaService from "../services/empresa.service";
import respostaService from "../services/resposta.service";
import type { Resposta } from "@/types/resposta";


export function useCreateResposta(onFinish?: () => void) {
  const queryClient = useQueryClient()
  const { show } = useToast()

  return useMutation({
    mutationFn: (resposta: Resposta[]) => respostaService.cadastrarResposta(resposta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['respostas'] })
      show('Resposta criada com sucesso!', 'info')

      if (onFinish) onFinish()
    },
    onError: () => {
      show('Erro ao criar resposta', 'error')
    }
  })
}