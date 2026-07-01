import type { Resposta } from "./resposta"

export type EmpresaResponse ={
    idEmpresa: number,
    nome: string,
    cnpj: string,
    idUsuario: number,
    resposta: Resposta[]
}

export type EmpresaRequest = {
    nome: string,
    cnpj: string,
    idUsuario: number
}
