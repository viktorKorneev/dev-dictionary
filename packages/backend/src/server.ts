import termsRouter from './routes/terms.routes.js'
import express from 'express'
import db from './db.js'

// Создаём приложение Express
const app = express()

app.use(express.json())

app.use('/api/terms', termsRouter)

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

app.delete('/api/terms/:id', (req, res) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
            message: 'Invalid term id',
        })
        return
    }

    const result = db
        .prepare('DELETE FROM terms WHERE id = ?')
        .run(id)

    if (result.changes === 0) {
        res.status(404).json({
            message: 'Term not found',
        })
        return
    }

    res.status(200).json({
        message: 'Term deleted successfully',
    })
})






// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})