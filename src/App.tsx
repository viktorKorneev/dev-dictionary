import {useEffect, useState} from 'react'
import type {Term} from './api/api'
import {termsAPI} from './api/api'
import './App.css'

function App() {
    const [terms, setTerms] = useState<Term[]>([])
    const [title, setTitle] = useState('')
    const [definition, setDefinition] = useState('')

    const [editingId, setEditingId] = useState<number | null>(null)
    const [editTitle, setEditTitle] = useState('')
    const [editDefinition, setEditDefinition] = useState('')


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

    const handleUpdate = (
        id: number,
        title: string,
        definition: string
    ) => {
        termsAPI.updateTerm(id, title, definition)
            .then(() => {
                setTerms((prevTerms) => prevTerms.map((term) => id === term.id ? {...term, title, definition} : term))
                setEditingId(null)
            })
            .catch((error) => {
                console.error('Failed to update term:', error)
            })
    }

    const handleEdit = (term: Term) => {
        // Твой код
        setEditingId(term.id)
        setEditTitle(term.title)
        setEditDefinition(term.definition)
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
                    {/*<h2>{term.title}</h2>*/}
                    {editingId !== term.id ?
                        <div>
                            <h2>{term.title}</h2>
                            <p>{term.definition}</p>
                        </div> :
                        <div>
                            <input value={editTitle} onChange={(e) => setEditTitle(e.currentTarget.value)}/>
                            <textarea value={editDefinition}
                                      onChange={(e) => setEditDefinition(e.currentTarget.value)}>
                            </textarea>
                            <button type="button" onClick={() => handleUpdate(term.id, editTitle, editDefinition)}>Сохранить</button>
                            <button type="button" onClick={() => setEditingId(null)}>Отмена</button>
                        </div>}

                    <button type="button" onClick={() => handleDelete(term.id)}>Удалить термин</button>
                    <button type="button" onClick={() => handleEdit(term)}>Редактировать</button>
                </div>
            ))}
        </>
    )
}

export default App
