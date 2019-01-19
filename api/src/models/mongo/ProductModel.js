const mongoose = require('mongoose')
let productSchema = mongoose.Schema({_id: {type: Number, required: true}, data: JSON}, {strict: false})
let Product = mongoose.model('Product', productSchema)
export default Product
