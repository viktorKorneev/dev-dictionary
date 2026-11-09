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
    createTerm(title: string, definition: string) {
        return instance.post<Term>('/api/terms', {
            title,
            definition,
        })
    },
    deleteTerm(id: number) {
        return instance.delete(`/api/terms/${id}`)
    },
    updateTerm(id: number, title: string, definition: string) {
        return instance.put(`/api/terms/${id}`, {
            title,
            definition,
        })
    },
}