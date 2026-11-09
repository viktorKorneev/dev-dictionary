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

async function createTerm(title: string, definition: string): Promise<Term> {
    const response = await fetch('http://localhost:3000/api/terms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, definition }),
    })

    console.log('Ответ Backend:', response.status)

    if (!response.ok) {
        throw new Error('Не удалось создать термин')
    }

    return response.json() as Promise<Term>
}

async function deleteTerm(id: number): Promise<void> {
    const response = await fetch(`http://localhost:3000/api/terms/${id}`, {
        method: 'DELETE',
    })

    if (response.status === 404) {
        throw new Error('Термин не найден')
    }

    if (!response.ok) {
        throw new Error('Не удалось удалить термин')
    }
}

async function updateTerm(id: number, title: string, definition: string,): Promise<Term> {
    const response = await fetch(`http://localhost:3000/api/terms/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, definition }),
    })

    if (response.status === 404) {
        throw new Error('Термин не найден')
    }

    if (!response.ok) {
        throw new Error('Не удалось обновить термин')
    }

    return response.json() as Promise<Term>
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

bot.command('help', async (ctx) => {
    await ctx.reply(
        `📚 Dev Dictionary — список команд

/start — запустить бота
/help — показать список команд

/list — показать все термины

/add Название Определение — добавить термин
Пример:
/add Closure Замыкание в JavaScript

/edit ID Название Определение — изменить термин
Пример:
/edit 16 Closure Новое определение

/delete ID — удалить термин
Пример:
/delete 16`,
    )
})

bot.command('list', async (ctx) => {
    try {
        const terms = await getTerms()

        if (terms.length === 0) {
            await ctx.reply('Словарь пока пуст.')
            return
        }

        const message = terms
            .map((term) => `🆔 ID: ${term.id}\n📘 ${term.title}\n${term.definition}`)
            .join('\n\n')

        await ctx.reply(message)
    } catch (error) {
        console.error('Ошибка получения терминов:', error)
        await ctx.reply('Не удалось загрузить термины. Попробуй позже.')
    }
})

bot.command('add', async (ctx) => {
    try {
        console.log('Команда /add получена:', ctx.match)

        const text = ctx.match.trim()

        const [title, ...definitionParts] = text.split(/\s+/)

        const definition = definitionParts.join(' ')

        if (!title || !definition) {
            await ctx.reply(
                'Используй формат:\n/add Название Определение',
            )
            return
        }

        const newTerm = await createTerm(title, definition)

        await ctx.reply(
            `✅ Термин успешно добавлен!\n\n📘 ${newTerm.title}\n${newTerm.definition}`,
        )
    } catch (error) {
        console.error('Ошибка добавления термина:', error)
        await ctx.reply('Не удалось добавить термин.')
    }
})

bot.command('delete', async (ctx) => {
    try {
        const id = Number(ctx.match.trim())

        if (!Number.isInteger(id) || id <= 0) {
            await ctx.reply('Укажи ID термина. Пример: /delete 1')
            return
        }

        await deleteTerm(id)

        await ctx.reply(`✅ Термин с ID ${id} успешно удалён!`)
    } catch (error) {
        console.error('Ошибка удаления термина:', error)
        if (error instanceof Error) {
            await ctx.reply(`❌ ${error.message}`)
        } else {
            await ctx.reply('❌ Произошла неизвестная ошибка.')
        }
    }
})

bot.command('edit', async (ctx) => {
    try {
        const text = ctx.match.trim()
        const [idPart, title, ...definitionParts] = text.split(/\s+/)

        const id = Number(idPart)
        const definition = definitionParts.join(' ')

        if (!Number.isInteger(id) || id <= 0 || !title || !definition) {
            await ctx.reply(
                'Используй формат:\n/edit ID Название Определение',
            )
            return
        }

        const updatedTerm = await updateTerm(id, title, definition)

        await ctx.reply(
            `✅ Термин успешно обновлён!\n\n🆔 ID: ${updatedTerm.id}\n📘 ${updatedTerm.title}\n${updatedTerm.definition}`,
        )
    } catch (error) {
        console.error('Ошибка редактирования термина:', error)

        if (error instanceof Error) {
            await ctx.reply(`❌ ${error.message}`)
        } else {
            await ctx.reply('❌ Произошла неизвестная ошибка.')
        }
    }
})

// Запускаем бота
bot.start()
