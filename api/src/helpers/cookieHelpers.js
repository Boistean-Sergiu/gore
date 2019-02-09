export const getFavs = (req, res, next) => {
  req.favs = []
  if (req.headers.cookie) {
    let cookies = req.headers.cookie.split('; ')
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].search('favourites') >= 0) {
        let splitted = cookies[i].split('=')
        if (splitted.length === 2) {
          req.favs = splitted[1].split(',')
          if (req.favs.length === 1 && req.favs[0] === '') {
            req.favs = []
          }
        }
      }
    }
  }
  next()
}
export const getUser = (req, res, next) => {
  let user = {}
  if (req.headers.cookie) {
    let cookies = req.headers.cookie.split('; ')
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].search('goreToken') >= 0) {
        let splitted = cookies[i].split('=')
        if (splitted.length === 2) {
          user.token = splitted[1]
        }
      }
      if (cookies[i].search('userId') >= 0) {
        let splitted = cookies[i].split('=')
        if (splitted.length === 2) {
          user.id = splitted[1]
        }
      }
      if (cookies[i].search('userName') >= 0) {
        let splitted = cookies[i].split('=')
        if (splitted.length === 2) {
          user.name = splitted[1]
        }
      }
    }
  }
  if (Object.keys(user).length > 0) {
    req.user = user
  }
  next()
}