import Product from '../models/mongo/ProductModel'

export const getProduct = async (req, res) => {
  try {
    let product = await Product.findOne({_id: parseInt(req.params.id, 10)}).exec()
    if (product) {
      return res.json(product)
    }
  } catch (err) {
    return res.status(err.api.error.status).json(err)
  }
  return res.status(401).json({error: 'Product not found'})
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
