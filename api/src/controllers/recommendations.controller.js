import Product from '../models/mongo/ProductModel'
import Favourite from '../models/mongo/FavouriteModel'
import { getImage } from './products.controller'

export const queryProducts = async (req, pId) => {
  let query = {}
  let {
    categories, country, packages, nutrition, fat,
    salt, sugar, sfat
  } = req.query
  if(pId){
    query._id = {$in: pId}
  }
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
  let terms = []
  if (categories && categories.length) {
    terms = [...terms, ...categories]
  }
  if (req.favs.length > 0) {
    let keywords = await Product.distinct('_keywords', {_id: {$in: req.favs}}).exec()
    terms = [...terms, ...keywords]
  }
  if (terms.length > 0) {
    terms = terms.map(term => `^${term}`)
    query._keywords = {$regex: terms.join('|')}
  }
  console.log(JSON.stringify(query))
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
  return products
}


export const getRecommendations = async (req, res) => {
  try {
    let products = []
    if(req.query.friends_ids){
      let favs = await Favourite.distinct('products', {user_id: {$in: req.query.friends_ids }}).exec()
      products = await queryProducts(req, favs)
    }
    if(products.length<10){
      products = [...products, ...(await  queryProducts(req))]
    }
    return res.json(products)
  } catch (err) {
    console.log(err)
    return res.status(err.api.error.status).json(err)
  }
}
