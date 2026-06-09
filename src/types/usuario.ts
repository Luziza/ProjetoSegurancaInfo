import type { EmpresaResponse } from "./empresa"

export type Usuario = {
    nome: string,
    email: string,
    senha: string,
    empresa: EmpresaResponse[]
}

export type UsuarioLogin = {
    login: string,
    senha: string,
}