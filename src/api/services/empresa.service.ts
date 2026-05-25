import type { EmpresaResponse } from "@/types/empresa"
import instance from "./http/axios"

const ENDPOINT = 'empresa'

export default {
  cadastrar(empresa: EmpresaResponse) {
    return instance.post<EmpresaResponse>(`/${ENDPOINT}`, empresa)
  },

  listar() {
    return instance.get<EmpresaResponse[]>(`/${ENDPOINT}`)
  }
}