import { useQuery } from "@tanstack/vue-query"
import useToast from "./userToast"
import type { AvaliacaoResponse } from "@/types/avaliacao"
import avaliacaoService from "../services/avaliacao.service"

export default function useAvaliacao() {
  const { show } = useToast()

  return useQuery<AvaliacaoResponse[]>({
    queryKey: ['modulos'],
    queryFn: async () => {
      const response = await avaliacaoService.listar()
      return response.data
    },
  })

}