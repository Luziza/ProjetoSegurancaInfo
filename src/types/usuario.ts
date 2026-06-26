import type { EmpresaResponse } from "./empresa"

export type Usuario = {
    id_usuario: number,
    nome: string,
    email: string,
    senha: string,
    empresas: EmpresaResponse[]
}

export type UsuarioLogin = {
    login: string,
    senha: string,
    
}

export type UsuarioToken = {
    token: string,
    usuario: Usuario
}

export type UsuarioRequest = {
    nome: string,
    login: string
    email: string,
    senha: string,
    empresas: EmpresaResponse[]
}

