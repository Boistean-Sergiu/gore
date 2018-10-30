import { Router } from 'express'
import mongoose from '../mongoose'
import * as ProductsController from '../controllers/products.controller'
import { catchErrors } from '../helpers/errorHelpers'

const api = Router()
mongoose.on('error', console.error.bind(console, 'connection error:'))
mongoose.once('open', function () {
  console.log('mongo is connected!')
})
api.get('/products', catchErrors(ProductsController.getProducts))
api.get('/products/:id', catchErrors(ProductsController.getProduct))
export default api
