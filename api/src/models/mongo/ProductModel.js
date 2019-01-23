const mongoose = require('mongoose')
let productSchema = mongoose.Schema({_id: {type: String, required: true}, data: JSON}, {strict: false})
let Product = mongoose.model('Product', productSchema)
export default Product
