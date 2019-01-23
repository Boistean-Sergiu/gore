import 'babel-polyfill'
import Product from '../models/mongo/ProductModel'
import mongoose from '../mongoose'
import scrape from 'html-metadata'

let skip = 7601
mongoose.on('error', () => {
  console.log('error', {message: `PLAYERS connection error`})
  console.error.bind(console, 'connection error:')
})
mongoose.once('open', async () => {
  console.log('info', `START`)
  process.on('unhandledRejection', async () => {
    await iterateProducts(skip)
    process.exit(0)
  })
  await iterateProducts(skip)
  console.log('info', `END`)
  process.exit(0)

})

export const iterateProducts = async (sk = 0) => {
  let players = await Product.find().select('_id').skip(sk).cursor()
  await players.eachAsync(async doc => {
    console.log(skip)
    skip++
    await updateProduct(doc)
  })
  return true
}
export const updateProduct = async (doc) => {
  doc = JSON.parse(JSON.stringify(doc))
  doc.id = doc._id.toString()
  doc.image = await getImage(`https://world.openfoodfacts.org/product/${doc._id}`)
  await Product.updateOne({_id: {$regex: doc._id}}, doc, {upsert: true}, () => {})
  return true
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
