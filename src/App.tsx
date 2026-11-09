import {useEffect, useState} from 'react'
import type {Term} from './api/api'
import {termsAPI} from './api/api'
import './App.css'

function App() {
    const [terms, setTerms] = useState<Term[]>([])
    const [title, setTitle] = useState('')
    const [definition, setDefinition] = useState('')

    useEffect(() => {
        termsAPI.getTerms()
            .then((res) => {
                console.log('Получены термины:', res.data)
                setTerms(res.data)
            })
            .catch((error) => {
                console.error('Failed to fetch terms:', error)
            })
    }, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        termsAPI.createTerm(title, definition)
            .then((res) => {
                setTerms((prevTerms) => [...prevTerms, res.data])
                setTitle('')
                setDefinition('')
            })
            .catch((error) => {
                console.error('Failed to create term:', error)
            })
    }

    const handleDelete = (id: number) => {
        termsAPI.deleteTerm(id)
            .then(() => {
                setTerms((prevTerms) => prevTerms.filter((term) => id !== term.id))
            }).catch((error) => {
            console.error('Failed to delete term:', error)
        })
    }

    return (
        <>
            <h1>Dev Dictionary</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Название термина"
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                />

                <textarea
                    placeholder="Определение термина"
                    value={definition}
                    onChange={(e) => setDefinition(e.currentTarget.value)}
                />

                <button type="submit">
                    Добавить термин
                </button>
            </form>

            {terms.map((term) => (
                <div key={term.id}>
                    <h2>{term.title}</h2>
                    <p>{term.definition}</p>
                    <button onClick={() => handleDelete(term.id)}>Удалить термин</button>
                </div>
            ))}
        </>
    )
}

export default App
