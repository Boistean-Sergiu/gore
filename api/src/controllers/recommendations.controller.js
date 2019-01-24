import Product from '../models/mongo/ProductModel'
import { getImage } from './products.controller'

export const getRecommendations = async (req, res) => {
  try {
    let query = {}
    let {
      categories, country, nutrition, fat,
      salt, sugar, sfat
    } = req.query
    if (country !== 'all') {
      query.countries = {$regex: country}
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
    console.log(JSON.stringify(query))
    let products = await Product.find(query).limit(5).exec()
    return res.json(products)
  } catch (err) {
    console.log(err)
    return res.status(err.api.error.status).json(err)
  }
}
