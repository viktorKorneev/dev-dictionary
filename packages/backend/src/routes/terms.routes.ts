import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (_req, res) => {
    const terms = db
        .prepare('SELECT id, title, definition FROM terms')
        .all()

    res.json(terms)
})

export default router