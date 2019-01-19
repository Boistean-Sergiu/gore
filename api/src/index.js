import 'idempotent-babel-polyfill'
import http from 'http'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import routes from './routes'
import config from './config'
import expressValidation from 'express-validation'
import APIError from './helpers/APIError'
import httpStatus from 'http-status'
import compression from 'compression'

require('dotenv').config()

let app = express()
app.use(compression())
app.server = http.createServer(app)

// logger
app.use(morgan('dev'))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.json())       // to support JSON-encoded bodies
app.use(helmet())
// 3rd party middleware
app.use(cors({
  origin: '*',
  credentials: true
}))
// static files
app.use(express.static('public'))
app.use('/api', routes)

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ')
    const error = new APIError(unifiedErrorMessage, err.status, true)
    return next(error)
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, true)
    return next(apiError)
  }
  return next(err)
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND)
  return next(err)
})

app.use((err, req, res, next) => {
  res.status(err.status).json({
    error_type: httpStatus[err.status],
    errors: {
      default: {
        msg: err.isPublic ? err.message : httpStatus[err.status],
        stack: err.stack
      }
    }
  })
})

app.server.listen(config.port, () => {
  console.log(`Started on port ${config.port} (${config.env})`)
})

export default app
