import instance from "./http/axios"
import type { Usuario, UsuarioLogin, UsuarioToken } from "@/types/usuario"


const ENDPOINT = 'usuario'

export default {
  cadastrarUsuario(usuario: Usuario) {
    return instance.post<Usuario>(`/${ENDPOINT}`, usuario)
  },

  loginUsuario(usuarioLogin: UsuarioLogin) {
    return instance.post<UsuarioToken>(`${ENDPOINT}/login`, usuarioLogin)
  }
}