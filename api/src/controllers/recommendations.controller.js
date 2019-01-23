import Product from '../models/mongo/ProductModel'

export const getRecommendations = async (req, res) => {
  try {
    let product = await Product.find().limit(5).exec()
    return res.json(product)
  } catch (err) {
    console.log(err)
    return res.status(err.api.error.status).json(err)
  }
  return res.status(401).json({error: 'Product not found'})
}
