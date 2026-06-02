import instance from "./http/axios"
import type { Usuario, UsuarioLogin } from "@/types/usuario"


const ENDPOINT = 'usuario'

export default {
  cadastrarUsuario(usuario: Usuario) {
    return instance.post<Usuario>(`/${ENDPOINT}`, usuario)
  },

  loginUsuario(usuarioLogin: UsuarioLogin) {
    return instance.post(`${ENDPOINT}/login`, usuarioLogin)
  }
}