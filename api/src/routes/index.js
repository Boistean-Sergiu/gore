import { Router } from 'express'
import mongoose from '../mongoose'
import * as ProductsController from '../controllers/products.controller'
import * as RecommendationsController from '../controllers/recommendations.controller'
import * as FavouritesController from '../controllers/favourites.controller'
import { catchErrors } from '../helpers/errorHelpers'
import { getFavs, getUser } from '../helpers/cookieHelpers'

const api = Router()
mongoose.on('error', console.error.bind(console, 'connection error:'))
mongoose.once('open', function () {
  console.log('mongo is connected!')
})
api.get('/products', catchErrors(ProductsController.getProducts))
api.get('/products/:id', catchErrors(ProductsController.getProduct))
api.get('/recommendations', getFavs, catchErrors(RecommendationsController.getRecommendations))
api.put('/favourites', getFavs, getUser, catchErrors(FavouritesController.updateFavourites))
export default api
