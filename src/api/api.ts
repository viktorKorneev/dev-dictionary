import axios from 'axios'

export type Term = {
    id: number
    title: string
    definition: string
}

const instance = axios.create({
    baseURL: 'http://localhost:3000',
})

export const termsAPI = {
    getTerms() {
        return instance.get<Term[]>('/api/terms')
    },
}