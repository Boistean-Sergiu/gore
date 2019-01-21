import scrape from 'html-metadata'
import Product from '../models/mongo/ProductModel'

export const getProduct = async (req, res) => {
  try {
    let product = await Product.findOne({_id: {$regex: req.params.id}}).exec()
    if (product) {
      product = product.toObject()
      product.image = await getImage(`https://world.openfoodfacts.org/product/${product._id}`)
      return res.json(product)
    }
  } catch (err) {
    console.log(err)
    return res.status(err.api.error.status).json(err)
  }
  return res.status(401).json({error: 'Product not found'})
}

export const getImage = async (targetUrl) => {
  try {
    let metadata = await scrape(targetUrl)
    if (metadata && metadata.twitter && metadata.twitter.image) {
      return metadata.twitter.image
    }
    return ''
  } catch (e) {
    return ''
  }
}

export const getProducts = async (req, res) => {
  try {
    let products
    if (req.query.ids) {
      let ids = await req.query.ids.split(',').map(parseFloat)
      console.log(ids)
      products = await Product.find({_id: {$in: ids}}).exec()
    } else {
      products = await Product.find().limit(20).exec()
    }
    return res.json(products)
  } catch (err) {
    return res.status(err.api.error.status).json(err)
  }
}
