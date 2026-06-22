import type { Resposta } from "./resposta"

export type AvaliacaoResponse = {
    id_avaliacao: number
    data: Date
    idEmpresa: number
    tipo_pergunta: number
    nomeModulo: String
    respostas: Resposta[]
}