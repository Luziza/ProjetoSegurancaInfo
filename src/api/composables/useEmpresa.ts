import { useQueryClient, useMutation, useQuery } from "@tanstack/vue-query";
import useToast from "./userToast";
import type { EmpresaRequest, EmpresaResponse } from "@/types/empresa";
import empresaService from "../services/empresa.service";
import instance from "../services/http/axios";


export function useEmpresaCadastro(onFinish?: () => void) {
  const queryClient = useQueryClient()
  const { show } = useToast()

  return useMutation({
    mutationFn: (empresa: EmpresaRequest) => empresaService.cadastrar(empresa),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] })

      queryClient.invalidateQueries({
        queryKey: ['usuario'] // ou ['usuario', id]
      })

      show('Empresa criada com sucesso!', 'info')

      if (onFinish) onFinish()
    }

  })
}

export function useEmpresaDeletar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (idEmpresa: number) => (empresaService.deletar(idEmpresa)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] })
    }
  })
}