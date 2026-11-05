import express from 'express'

type Term = {
    id: number
    title: string
    definition: string
}

// Создаём приложение Express
const app = express()

app.use(express.json())

const terms: Term[] = [
    {
        id: 1,
        title: 'Promise',
        definition: 'Объект для работы с асинхронными операциями',
    },
    {
        id: 2,
        title: 'Closure',
        definition: 'Замыкание в JavaScript',
    },
]

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

    const newTerm: Term = {
        id: Date.now(),
        title,
        definition,
    }

    terms.push(newTerm)

    res.status(201).json(newTerm)
})


// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})