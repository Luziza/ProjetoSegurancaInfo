import type { EmpresaRequest, EmpresaResponse } from "@/types/empresa"
import instance from "./http/axios"

const ENDPOINT = 'empresa'

export default {
  cadastrar(empresa: EmpresaRequest) {
    return instance.post<EmpresaResponse>(`/${ENDPOINT}/cadastrar`, empresa)
  },

  listar(id_usuario: number) {
    return instance.get<EmpresaResponse[]>(`/${ENDPOINT}/usuario/${id_usuario}`)
  }
}