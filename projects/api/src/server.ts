import express, { Application } from 'express'
import apis from './api/index'

const app: Application = express()

app.use(express.json())
app.use('/api', apis)

const port: number = process.env.PORT
  ? parseInt(process.env.PORT)
  : 80

app.listen(port, () => console.log(`Listening on port ${port}`))
