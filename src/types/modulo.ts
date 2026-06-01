import type { Pergunta } from "./perguntas"

export type Modulos = {
    nome: string,
    descricao: string
    tipo_pergunta: number
    perguntas: Pergunta[]
}
