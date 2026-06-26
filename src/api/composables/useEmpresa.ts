import { useQueryClient, useMutation } from "@tanstack/vue-query";
import useToast from "./userToast";
import type { EmpresaRequest, EmpresaResponse } from "@/types/empresa";
import empresaService from "../services/empresa.service";


export function useEmpresa(onFinish?: () => void) {
  const queryClient = useQueryClient()
  const { show } = useToast()

  return useMutation({
    mutationFn: (empresa: EmpresaRequest) => empresaService.cadastrar(empresa),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] })
      show('Empresa criada com sucesso!', 'info')

      if (onFinish) onFinish()
    },
    onError: () => {
      show('Erro ao criar empresa', 'error')
    }
  })
}