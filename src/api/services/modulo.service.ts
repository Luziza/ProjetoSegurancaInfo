import type { EmpresaResponse } from "@/types/empresa"
import instance from "./http/axios"
import type {  Modulos } from "@/types/modulo"

const ENDPOINT = 'modulos'

export default {
  modulos() {
    return instance.get<Modulos[]>(`/${ENDPOINT}`)
  },

  modulosPergunta(modulo: Modulos) {
    return instance.get<Modulos>(`/${ENDPOINT}/${modulo.tipo_pergunta}`)
  }
}