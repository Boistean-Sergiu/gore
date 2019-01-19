const mongoose = require('mongoose');

let productSchema = mongoose.Schema(
    {
        _id: {type: Number, required: true},
        data: JSON
    },
    {
        strict: false
    }
);

productSchema.methods.getProduct = function getProduct() {
    return {
        id: this._id,
        data: this.data
    }
}

let Product = mongoose.model('Product', productSchema);

export default Product
