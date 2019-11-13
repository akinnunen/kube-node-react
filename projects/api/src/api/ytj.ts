import { Router, Request, Response } from 'express'
import { SearchResults } from '@knr/models'
import * as ytjSearch from '../service/ytjSearch'

const router = Router()

router.get('/search', async (req: Request, res: Response): Promise<any> => {

  const name: string = req.query.name

  // FIXME: can throw, check also Promise<any> ^
  const results: SearchResults = await ytjSearch.run(name)

  return res.json(results)

})

export default router
