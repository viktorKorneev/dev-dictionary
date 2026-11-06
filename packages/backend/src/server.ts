import express from 'express'
import cors from 'cors'
import termsRouter from './routes/terms.routes.js'


// Создаём приложение Express
const app = express()

// Разрешаем запросы с React frontend
app.use(cors({
    origin: 'http://localhost:5173',
}))

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

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})