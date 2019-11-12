import { Router, Request, Response } from 'express'
import * as ytjSearch from '../service/ytjSearch'

const router = Router()

router.get('/search', async (req: Request, res: Response): Promise<any> => {

  const name: string | undefined = req.query.name

  const results = await ytjSearch.search(name)

  return res.json(results)

})

export default router
