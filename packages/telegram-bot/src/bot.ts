import { Bot } from 'grammy'

// Создаём экземпляр Telegram-бота
const bot = new Bot('YOUR_BOT_TOKEN')

// Обрабатываем команду /start
bot.command('start', async (ctx) => {
    await ctx.reply('Привет! Добро пожаловать в Dev Dictionary!')
})

// Запускаем бота
bot.start()
