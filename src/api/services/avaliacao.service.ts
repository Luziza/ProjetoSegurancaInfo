import instance from "./http/axios"
import type { AvaliacaoResponse } from "@/types/avaliacao"

const ENDPOINT = 'avaliacao'

export default {
  listar(id: number) {
    return instance.get<AvaliacaoResponse[]>(`/${ENDPOINT}/${id}`)
  }
}