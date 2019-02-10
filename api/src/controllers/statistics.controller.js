import Favourite from '../models/mongo/FavouriteModel'
import Product from '../models/mongo/ProductModel'
import _ from 'lodash'

export const getData = async (req, res) => {
  try {
    return res.json({
      countries: await countryStatistics(),
      categories: await categoriesStatistics(),
      fat: await nutritionStatistics('fat'),
      salt: await nutritionStatistics('salt'),
      sugar: await nutritionStatistics('sugars'),
      sfat: await nutritionStatistics('saturated-fat'),
    })
  } catch (err) {
    console.log(err)
    return res.json({})
  }
}

export async function countryStatistics () {
  let data = {}
  let favs = await Favourite.distinct('products').exec()
  let countries = await Product.distinct('countries', {_id: {$in: favs}}).exec()
  countries = countries.map(country => country.split(','))
  countries = _.flatten(countries)
  for (let i = 0; i < countries.length; i++) {
    data[countries[i]] = await Product.find({'countries': {$regex: countries[i]}, _id: {$in: favs}}).count()
  }
  return data
}

export async function categoriesStatistics () {
  let data = {}
  let categories = [
    {value: 'food|aliments', key: 'food'},
    {value: 'beverage|boisson', key: 'beverage'},
    {value: 'sweet|bonbon', key: 'sweet'},
    {value: 'snack|colation', key: 'snack'},
    {value: 'dairie|laiterie', key: 'dairie'},
    {value: 'meat|viande', key: 'meat'}
  ]
  let favs = await Favourite.distinct('products').exec()
  for (let i = 0; i < categories.length; i++) {
    data[categories[i].key] = await Product.find({
      $or: [
        {'categories': {$regex: categories[i].value, $options: 'i'}, _id: {$in: favs}},
        {'_keywords': {$regex: categories[i].value, $options: 'i'}, _id: {$in: favs}}
      ]
    }).count()
  }
  return data
}

export async function nutritionStatistics (nutrient) {
  let data = {}
  let options = ['low', 'moderate', 'high']
  let favs = await Favourite.distinct('products').exec()
  for (let i = 0; i < options.length; i++) {
    data[options[i]] = await Product.find({[`nutrient_levels.${nutrient}`]:options[i], _id: {$in: favs}}).count()
  }
  return data
}