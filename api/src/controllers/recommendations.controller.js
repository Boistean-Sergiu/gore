import Product from '../models/mongo/ProductModel'
import { getImage } from './products.controller'

export const getRecommendations = async (req, res) => {
  try {
    let products = await Product.find({}).limit(5).exec()
    if (products) {
      products = JSON.parse(JSON.stringify(products))
      for (let i = 0; i < products.length; i++) {
        if (!products[i].image) {
          products[i].image = await getImage(`https://world.openfoodfacts.org/product/${products[i]._id}`)
          await Product.updateOne({code: products[i].code}, {image: products[i].image}, {upsert: true}, () => {})
        }
      }
    }
    return res.json(products)
  } catch (err) {
    console.log(err)
    return res.status(err.api.error.status).json(err)
  }
  return res.status(401).json({error: 'Product not found'})
}
