import { useQueryClient, useMutation, useQuery } from "@tanstack/vue-query";
import useToast from "./userToast";
import type { EmpresaRequest, EmpresaResponse } from "@/types/empresa";
import empresaService from "../services/empresa.service";


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

// export default function useEmpresa() {
//   const { show } = useToast()

//   return useQuery<EmpresaResponse[]>({
//     queryKey: ['modulos'],
//     queryFn: async () => {
//       const response = await empresaService.listar()
//       return response.data
//     },
//   })
// }