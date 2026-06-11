import type { Resposta } from "./resposta"

export type EmpresaResponse ={
    id_empresa: number,
    nome: String,
    cnpj: String,
    id_usuario: number,
    resposta: Resposta[]
}
