import Database from 'better-sqlite3'

// Создаём или открываем базу данных
const db = new Database('dev-dictionary.db')

// Включаем поддержку внешних ключей
db.pragma('foreign_keys = ON')

// Создаём таблицу терминов, если её ещё нет
db.exec(`
    CREATE TABLE IF NOT EXISTS terms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        definition TEXT NOT NULL
    )
`)

// Экспортируем подключение к базе
export default db