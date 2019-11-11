import { Router, Request, Response } from 'express'

const router = Router()

router.get('/search', (req: Request, res: Response): object => {
  return res.json({ status: 'success', message: 'Hello' })
})

export default router
