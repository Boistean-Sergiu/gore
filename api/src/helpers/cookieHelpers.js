export const getFavs = (req, res, next) => {
  req.favs = []
  if (req.headers.cookie) {
    let cookies = req.headers.cookie.split('; ')
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].search('favourites') >= 0) {
        let splitted = cookies[i].split('=')
        if (splitted.length === 2) {
          req.favs = splitted[1].split(',')
        }
      }
    }
  }
  next()
}