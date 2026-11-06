import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/', (_req, res) => {
    const terms = db
        .prepare('SELECT id, title, definition FROM terms')
        .all()

    res.json(terms)
})

router.get('/:id', (req, res) => {
    const id = Number(req.params.id)

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
            message: 'Invalid term id',
        })
        return
    }

    const term = db
        .prepare('SELECT id, title, definition FROM terms WHERE id = ?')
        .get(id)

    if (!term) {
        res.status(404).json({
            message: 'Term not found',
        })
        return
    }

    res.json(term)
})

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
    const id = Number(req.params.id)
    const { title, definition } = req.body

    if (
        !Number.isInteger(id) || id <= 0 ||
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

export default router