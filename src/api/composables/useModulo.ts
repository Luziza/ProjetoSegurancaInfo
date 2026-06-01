import { useQuery } from '@tanstack/vue-query'
import type { Modulos } from '@/types/modulo'
import useToast from './userToast'
import moduloService from '../services/modulo.service'
import type { Ref } from 'vue'

export default function useModulo() {
  const { show } = useToast()

  return useQuery<Modulos[]>({
    queryKey: ['modulos'],
    queryFn: async () => {
      const response = await moduloService.modulos()
      return response.data
    },
  })

}

export function useModulosEscolhido(tipo_pergunta: Ref<number>) {
  return useQuery({
    queryKey: ['modulos', tipo_pergunta],      
    queryFn: () =>
      moduloService.modulosPergunta({tipo_pergunta: tipo_pergunta.value} as Modulos).then(res => res.data),
    enabled: () => tipo_pergunta.value > 0        
  })
}