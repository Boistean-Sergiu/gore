const mongoose = require('mongoose')

let favouriteSchema = mongoose.Schema(
  {
    user_id: {type: Number, required: true},
    product: {type: Array, required: false}
  },
  {
    strict: false
  }
)

let Favourite = mongoose.model('Favourite', favouriteSchema)

export default Favourite