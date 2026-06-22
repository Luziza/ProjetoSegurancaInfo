import type { EmpresaResponse } from "@/types/empresa"
import instance from "./http/axios"
import type { Resposta } from "@/types/resposta"


const ENDPOINT = 'resposta'

export default {
  cadastrarResposta(resposta: Resposta[] | Resposta) {
    return instance.post<Resposta | Resposta[]>(`/${ENDPOINT}`, resposta)
  }

  
}