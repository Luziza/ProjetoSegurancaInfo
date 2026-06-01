import instance from "./http/axios"
import type { Pergunta } from "@/types/perguntas"

const ENDPOINT = 'perguntas'

export default {
  listar() {
    return instance.get<Pergunta[]>(`/${ENDPOINT}`)
  }
}