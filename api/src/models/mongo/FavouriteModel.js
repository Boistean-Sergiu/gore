const mongoose = require('mongoose');

let favouriteSchema = mongoose.Schema(
  {
    user_id: {type: Number, required: true},
    product_id: {type: Number, required: true}
  },
  {
    strict: false
  }
);

let Favourite = mongoose.model('Favourite', favouriteSchema);

export default Favourite