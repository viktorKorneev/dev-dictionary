import 'dotenv/config'
import { Bot } from 'grammy'

type Term = {
    id: number
    title: string
    definition: string
}

async function getTerms(): Promise<Term[]> {
    const response = await fetch('http://localhost:3000/api/terms')

    if (!response.ok) {
        throw new Error('Не удалось получить термины')
    }

    return response.json() as Promise<Term[]>
}

// Создаём экземпляр Telegram-бота
const token = process.env.BOT_TOKEN

if (!token) {
    throw new Error('BOT_TOKEN не найден в файле .env')
}

const bot = new Bot(token)

// Обрабатываем команду /start
bot.command('start', async (ctx) => {
    await ctx.reply('Привет! Добро пожаловать в Dev Dictionary!')
})

bot.command('list', async (ctx) => {
    try {
        const terms = await getTerms()

        if (terms.length === 0) {
            await ctx.reply('Словарь пока пуст.')
            return
        }

        const message = terms
            .map((term) => `📘 ${term.title}\n${term.definition}`)
            .join('\n\n')

        await ctx.reply(message)
    } catch (error) {
        console.error('Ошибка получения терминов:', error)
        await ctx.reply('Не удалось загрузить термины. Попробуй позже.')
    }
})

// Запускаем бота
bot.start()
