import Product from '../models/mongo/ProductModel'
import { getImage } from './products.controller'

export const getRecommendations = async (req, res) => {
  try {
    let query = {}
    let {
      categories, country, packages, nutrition, fat,
      salt, sugar, sfat
    } = req.query
    if (country !== 'all') {
      query.countries = {$regex: country}
    }
    if (packages !== 'all') {
      query.packaging = {$regex: packages}
    }
    if (nutrition !== 'all') {
      query.nutrient_grades = nutrition
    }
    if (fat !== 'all') {
      query['nutrient_levels.fat'] = fat
    }
    if (salt !== 'all') {
      query['nutrient_levels.salt'] = salt
    }
    if (sugar !== 'all') {
      query['nutrient_levels.sugars'] = sugar
    }
    if (sfat !== 'all') {
      query['nutrient_levels.saturated-fat'] = sfat
    }
    if (categories && categories.length) {
      let dinamicQuery = {$or: []}
      for (let i = 0; i < categories.length; i++) {
        dinamicQuery.$or.push({
          ...query,
          _keywords: {$regex: categories[i]}
        })
      }
      query = dinamicQuery
    }
    let products = await Product.find(query).limit(5).exec()
    if (products) {
      products = JSON.parse(JSON.stringify(products))
      for (let i = 0; i < products.length; i++) {
        if (products[i].image === undefined) {
          products[i].image = await getImage(`https://world.openfoodfacts.org/product/${products[i]._id}`)
          await Product.updateOne({code: {$regex: products[i].code}}, {image: products[i].image}, {upsert: true}, () => {})
        }
      }
    }
    return res.json(products)
  } catch (err) {
    console.log(err)
    return res.status(err.api.error.status).json(err)
  }
}
