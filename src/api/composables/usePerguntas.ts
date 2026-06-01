import { useQuery } from '@tanstack/vue-query'
import type { Pergunta } from '@/types/perguntas'
import perguntaService from '../services/pergunta.service'

export default function usePerguntas() {

  return useQuery<Pergunta[]>({
    queryKey: ['perguntas'],

    queryFn: async () => {
      const res = await perguntaService.listar()
      return res.data
    },
  })
}