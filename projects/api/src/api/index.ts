import { Router, Request, Response, NextFunction } from 'express'
import ytj from './ytj'

const router = Router()

router.use('/ytj', ytj)

router.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('Route not found')
  next(error)
})

router.use((error: { message: string; status: number }, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500)
    res.json({
      status: 'error',
      message: error.message
    })
    next()
  }
)

export default router
