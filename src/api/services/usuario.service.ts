import { isConstructSignatureDeclaration } from "typescript"

import instance from "./http/axios"
import type { Usuario, UsuarioLogin, UsuarioRequest, UsuarioToken } from "@/types/usuario"


const ENDPOINT = 'usuario'

export default {
  cadastrarUsuario(usuario: UsuarioRequest) {
    return instance.post<Usuario>(`/${ENDPOINT}/cadastroUsuario`, usuario)
  },

  loginUsuario(usuarioLogin: UsuarioLogin) {
    return instance.post<UsuarioToken>(`${ENDPOINT}/login`, usuarioLogin)
  },

  usuario(id_usuario: number){
    return instance.get<Usuario>(`${ENDPOINT}/${id_usuario}`)
  }
}