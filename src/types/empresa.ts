import type { Resposta } from "./resposta"

export type EmpresaResponse ={
    idEmpresa: number,
    nome: String,
    cnpj: String,
    id_usuario: number,
    resposta: Resposta[]
}

export type EmpresaRequest = {
    nome: String,
    cnpj: String,
    id_usuario: number
}
