import { Router, Request, Response, NextFunction } from 'express'
import { SearchResults } from '@knr/models'
import * as ytjSearch from '../service/ytjSearch'

const router = Router()

const handleAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise
    .resolve(fn(req, res, next))
    .catch(next)

router.get('/search', handleAsync(async (req: Request, res: Response): Promise<any> => {
  const name: string = req.query.name
  const results: SearchResults = await ytjSearch.run(name)
  return res.json(results)

}))

export default router
