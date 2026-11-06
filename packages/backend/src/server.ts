import express from 'express'
import db from './db.js'

// Создаём приложение Express
const app = express()
console.log('Database connected successfully!')

app.use(express.json())

const tables = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
    .all()

console.log('Tables:', tables)

// type Term = {
//     id: number
//     title: string
//     definition: string
// }
//
// const terms: Term[] = [
//     {
//         id: 1,
//         title: 'Promise',
//         definition: 'Объект для работы с асинхронными операциями',
//     },
//     {
//         id: 2,
//         title: 'Closure',
//         definition: 'Замыкание в JavaScript',
//     },
// ]

// Указываем порт сервера
const PORT = 3000

// Создаём GET-маршрут
app.get('/', (_req, res) => {
    res.send('Dev Dictionary API is running!')
})

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'Dev Dictionary API is running!',
    })
})

app.get('/api/terms', (_req, res) => {
    const terms = db
        .prepare('SELECT id, title, definition FROM terms')
        .all()

    res.json(terms)
})

app.get('/api/terms/:id', (_req, res) => {
    const term = terms.find(t => t.id === Number(_req.params.id))

    if (!term) {
        res.status(404).json({
            message: 'Term not found',
        })
        return
    }
    res.json(term)
})

app.post('/api/terms', (req, res) => {
    const { title, definition } = req.body

    if (
        typeof title !== 'string' ||
        typeof definition !== 'string' ||
        title.trim() === '' ||
        definition.trim() === ''
    ) {
        res.status(400).json({
            message: 'Title and definition are required',
        })
        return
    }

    const result = db
        .prepare('INSERT INTO terms (title, definition) VALUES (?, ?)')
        .run(title.trim(), definition.trim())

    const newTerm = db
        .prepare('SELECT id, title, definition FROM terms WHERE id = ?')
        .get(result.lastInsertRowid)

    res.status(201).json(newTerm)
})

app.put('/api/terms/:id', (req, res) => {
    const id = Number(req.params.id)
    const { title, definition } = req.body

    if (
        !Number.isInteger(id) ||
        typeof title !== 'string' ||
        typeof definition !== 'string' ||
        title.trim() === '' ||
        definition.trim() === ''
    ) {
        res.status(400).json({
            message: 'Invalid id, title or definition',
        })
        return
    }

    const result = db
        .prepare('UPDATE terms SET title = ?, definition = ? WHERE id = ?')
        .run(title.trim(), definition.trim(), id)

    if (result.changes === 0) {
        res.status(404).json({
            message: 'Term not found',
        })
        return
    }

    const updatedTerm = db
        .prepare('SELECT id, title, definition FROM terms WHERE id = ?')
        .get(id)

    res.json(updatedTerm)
})

app.delete('/api/terms/:id', (req, res) => {
    const id = Number(req.params.id)

    const termIndex = terms.findIndex(t => t.id === id)

    if (termIndex === -1) {
        res.status(404).json({
            message: 'Term not found',
        })
        return
    }

    terms.splice(termIndex, 1)

    res.status(200).json({
        message: 'Term deleted successfully',
    })
})


// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})