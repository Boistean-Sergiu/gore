import Favourite from '../models/mongo/FavouriteModel'

export const updateFavourites = async (req, res) => {
  try {
    if (req.user && req.user.id) {
      await Favourite.updateOne({user_id: req.user.id}, {
        user_id: req.user.id,
        products: req.favs
      }, {upsert: true}, () => {})
    }
  } catch (err) {
    console.log(err)
    return res.status(err.api.error.status).json(err)
  }
  return res.json('')
}

