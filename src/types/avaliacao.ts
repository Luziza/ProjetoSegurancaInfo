import type { Resposta } from "./resposta"

export type AvaliacaoResponse = {
    id_avaliacao: number
    data: Date
    id_empresa: number
    respostas: Resposta[]
}