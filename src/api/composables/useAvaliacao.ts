import { useQuery } from "@tanstack/vue-query"
import useToast from "./userToast"
import type { AvaliacaoResponse } from "@/types/avaliacao"
import avaliacaoService from "../services/avaliacao.service"

export default function useAvaliacao(id: number) {
  const { show } = useToast()

  return useQuery<AvaliacaoResponse[]>({
    queryKey: ['avaliacao', id],
    queryFn: async () => {
      const response = await avaliacaoService.listar(id)
      return response.data
    },
  })

}