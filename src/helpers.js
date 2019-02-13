export const onReady = (code) => {
  document.addEventListener('DOMContentLoaded', function () {
    code()
  })
}
let hideLoader = () => {
  let loader = document.getElementById('loader')
  if (loader) {
    loader.style.display = 'none'
  }
}
let showLoader = () => {
  let loader = document.getElementById('loader')
  if (loader) {
    loader.style.display = 'block'
  }
}

let ZBRangeSlider = function (id) {
  let self = this
  let startX = 0
  let x = 0

  // retrieve touch button
  let slider = document.getElementById(id)
  let touchLeft = slider.querySelector('.slider-touch-left')
  let touchRight = slider.querySelector('.slider-touch-right')
  let lineSpan = slider.querySelector('.slider-line span')

  // get some properties
  let min = parseFloat(slider.getAttribute('data-min'))
  let max = parseFloat(slider.getAttribute('data-max'))

  // retrieve default values
  let defaultMinValue = min
  if (slider.hasAttribute('data-min-value')) {
    defaultMinValue = parseFloat(slider.getAttribute('data-min-value'))
  }
  let defaultMaxValue = max

  if (slider.hasAttribute('data-max-value')) {
    defaultMaxValue = parseFloat(slider.getAttribute('data-max-value'))
  }

  // check values are correct
  if (defaultMinValue < min) {
    defaultMinValue = min
  }

  if (defaultMaxValue > max) {
    defaultMaxValue = max
  }

  if (defaultMinValue > defaultMaxValue) {
    defaultMinValue = defaultMaxValue
  }

  let step = 0.0

  if (slider.getAttribute('se-step')) {
    step = Math.abs(parseFloat(slider.getAttribute('se-step')))
  }

  // normalize flag
  let normalizeFact = 26

  self.slider = slider
  self.reset = function () {
    touchLeft.style.left = '0px'
    touchRight.style.left = (slider.offsetWidth - touchLeft.offsetWidth) + 'px'
    lineSpan.style.marginLeft = '0px'
    lineSpan.style.width = (slider.offsetWidth - touchLeft.offsetWidth) + 'px'
    startX = 0
    x = 0
  }

  self.setMinValue = function (minValue) {
    let ratio = ((minValue - min) / (max - min))
    touchLeft.style.left = Math.ceil(ratio * (slider.offsetWidth - (touchLeft.offsetWidth + normalizeFact))) + 'px'
    lineSpan.style.marginLeft = touchLeft.offsetLeft + 'px'
    lineSpan.style.width = (touchRight.offsetLeft - touchLeft.offsetLeft) + 'px'
    slider.setAttribute('data-min-value', minValue)
  }

  self.setMaxValue = function (maxValue) {
    let ratio = ((maxValue - min) / (max - min))
    touchRight.style.left = Math.ceil(ratio * (slider.offsetWidth - (touchLeft.offsetWidth + normalizeFact)) + normalizeFact) + 'px'
    lineSpan.style.marginLeft = touchLeft.offsetLeft + 'px'
    lineSpan.style.width = (touchRight.offsetLeft - touchLeft.offsetLeft) + 'px'
    slider.setAttribute('data-max-value', maxValue)
  }

  // initial reset
  self.reset()

  // usefull values, min, max, normalize fact is the width of both touch buttons
  let maxX = slider.offsetWidth - touchRight.offsetWidth
  let selectedTouch = null
  let initialValue = (lineSpan.offsetWidth - normalizeFact)

  // set defualt values
  self.setMinValue(defaultMinValue)
  self.setMaxValue(defaultMaxValue)

  // setup touch/click events
  function onStart (event) {

    // Prevent default dragging of selected content
    event.preventDefault()
    let eventTouch = event

    if (event.touches) {
      eventTouch = event.touches[0]
    }

    if (this === touchLeft) {
      x = touchLeft.offsetLeft
    }
    else {
      x = touchRight.offsetLeft
    }

    startX = eventTouch.pageX - x
    selectedTouch = this
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onStop)
    document.addEventListener('touchmove', onMove)
    document.addEventListener('touchend', onStop)

  }

  function onMove (event) {
    let eventTouch = event

    if (event.touches) {
      eventTouch = event.touches[0]
    }

    x = eventTouch.pageX - startX

    if (selectedTouch === touchLeft) {
      if (x > (touchRight.offsetLeft - selectedTouch.offsetWidth + 10)) {
        x = (touchRight.offsetLeft - selectedTouch.offsetWidth + 10)
      }
      else if (x < 0) {
        x = 0
      }

      selectedTouch.style.left = x + 'px'
    }
    else if (selectedTouch === touchRight) {
      if (x < (touchLeft.offsetLeft + touchLeft.offsetWidth - 10)) {
        x = (touchLeft.offsetLeft + touchLeft.offsetWidth - 10)
      }
      else if (x > maxX) {
        x = maxX
      }
      selectedTouch.style.left = x + 'px'
    }

    // update line span
    lineSpan.style.marginLeft = touchLeft.offsetLeft + 'px'
    lineSpan.style.width = (touchRight.offsetLeft - touchLeft.offsetLeft) + 'px'

    // write new value
    calculateValue()

    // call on change
    if (slider.getAttribute('on-change')) {
      let fn = new Function('min, max', slider.getAttribute('on-change'))
      fn(slider.getAttribute('data-min-value'), slider.getAttribute('data-max-value'))
    }

    if (self.onChange) {
      self.onChange(slider.getAttribute('data-min-value'), slider.getAttribute('data-max-value'))
    }

  }

  function onStop (event) {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onStop)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onStop)

    selectedTouch = null

    // write new value
    calculateValue()

    // call did changed
    if (slider.getAttribute('did-changed')) {
      let fn = new Function('min, max', slider.getAttribute('did-changed'))
      fn(slider.getAttribute('data-min-value'), slider.getAttribute('data-max-value'))
    }

    if (self.didChanged) {
      self.didChanged(slider.getAttribute('data-min-value'), slider.getAttribute('data-max-value'))
    }
  }

  function calculateValue () {
    let newValue = (lineSpan.offsetWidth - normalizeFact) / initialValue
    let minValue = lineSpan.offsetLeft / initialValue
    let maxValue = minValue + newValue

    minValue = minValue * (max - min) + min
    maxValue = maxValue * (max - min) + min

    if (step !== 0.0) {
      let multi = Math.floor((minValue / step))
      minValue = step * multi

      multi = Math.floor((maxValue / step))
      maxValue = step * multi
    }

    slider.setAttribute('data-min-value', minValue)
    slider.setAttribute('data-max-value', maxValue)
  }

  // link events
  touchLeft.addEventListener('mousedown', onStart)
  touchRight.addEventListener('mousedown', onStart)
  touchLeft.addEventListener('touchstart', onStart)
  touchRight.addEventListener('touchstart', onStart)
}
export const initQuantitySlider = (id, label, filters) => {
  let newRangeSlider = new ZBRangeSlider(id)
  document.getElementById(label).innerHTML = 'Quantity 0g - 5000g'

  newRangeSlider.onChange = (min, max) => {
    document.getElementById(label).innerHTML = 'Quantity ' + parseInt(min, 10) + 'g' + ' - ' + parseInt(max, 10) + 'g'
  }

  newRangeSlider.didChanged = (min, max) => {
    filters.minQuantity = min
    filters.maxQuantity = max
    document.getElementById(label).innerHTML = 'Quantity ' + parseInt(min, 10) + 'g' + ' - ' + parseInt(max, 10) + 'g'
    getRecommendations(filters)
  }
}

export const fetchRecommendations = (params, friends = null) => {
  let newParams = params.flat(2)
  showLoader()
  if (friends && friends.data) {
    for (let i = 0; i < friends.data.length; i++) {
      newParams.push(`friends_ids[${i}]=${friends.data[i].id}`)
    }
  }
  fetch(`http://localhost:8080/api/recommendations?${newParams.join('&')}`, {
    credentials: 'include'
  }).then(response => response.json())
    .then(data => {
      paintRecommendedProducts(data)
      hideLoader()
    })
    .catch(function () {
      hideLoader()
      alert('Product does not exist in our database')
    })
}
export const getRecommendations = (filters) => {
  let params = Object.entries(filters).map(([key, val]) => {
      if (typeof val !== 'object') {
        return `${key}=${val}`
      } else {
        let filters = Object.entries(val)
        let finalFilters = []
        for (let i = 0; i < filters.length; i++) {
          if (filters[i][1]) {
            finalFilters.push(`${key}[${finalFilters.length}]=${filters[i][0]}`)
          }
        }
        return finalFilters
      }
    }
  )
  if (filters.friends) {
    let cb = function (friends) {
      fetchRecommendations(params, friends)
    }
    getFriends(cb)
  } else {
    fetchRecommendations(params)
  }
}

export function initScanner () {
  var reader = null
  var iptEl = document.getElementById('uploadImage')
  dynamsoft.dbrEnv.resourcesPath = 'https://demo.dynamsoft.com/dbr_wasm/js'
  dynamsoft.dbrEnv.licenseKey = 't0085VwAAADl5Os0WbqzWF5NBQCF2QIalXxPOM3uDCVlYKlLOJStKaBrtMt8LXvEeBmtapLBXk557e1R3IAIqZx4x7wRGaE1chbMnFiVHLmZREfAHpl4WZw=='
  dynamsoft.dbrEnv.onAutoLoadWasmSuccess = function () {
    reader = new dynamsoft.BarcodeReader()
  }
  iptEl.addEventListener('change', function () {
    reader.decodeFileInMemory(this.files[0]).then(function (results) {
      if (results && results.length) {
        fetchProduct(results[0].BarcodeText)
      } else {
        alert('Code was not recognised')
      }
    }).catch(ex => {
      alert('error:' + (ex.message || ex))
    })
    this.value = ''
  })
}

export function changeButtonText (id, text, oldClass, newClass) {
  let buttons = document.querySelectorAll(`[data-id='${id}']`)
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].innerHTML = text
    buttons[i].className = buttons[i].className.replace(oldClass, newClass)
  }
}

export function scan () {
  document.getElementById('uploadImage').click()
}

export function generateSVG (data, title) {
  let total = 0
  let keys = Object.keys(data)
  for (let i = 0; i < keys.length; i++) {
    total += data[keys[i]]
  }
  let svg = `<figure>
                <figcaption>${title}</figcaption>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                     class="chart" width="1000" height="${keys.length * 25 }">`
  for (let i = 0; i < keys.length; i++) {
    svg += `<g class="bar">
             <rect x="200" y="${i * 20}" width="${data[keys[i]] ? data[keys[i]] * 700 / total : 0}" height="19"></rect>
             <text y="${i * 20 + 9.5}" dy=".35em">${keys[i]} : ${data[keys[i]]}</text>
            </g>`
  }
  svg += `</svg>
            </figure>`
  return svg
}

export function generateProductHtml (product, removeBtn) {
  // if (!product.product_name) {
  //   return ''
  // }
  return '<div class="gr-mediaBox   ">\n' +
    '                        <img alt="coca cola" class=" product-image product-image"\n' +
    '                             src="' + product.image + '" onerror="this.onerror=null;this.src=\'img/404.jpg\';"/>\n' +
    '                        <div class="gr-mediaBox__desc gr-mediaBox__desc--clearfixOverflow">\n' +
    '                            <div class="product-name"><a\n' +
    '                                    target="_blank" href="' + (product.sources && product.sources.length && product.sources[0].url ? product.sources[0].url : '') + '"\n' +
    '                                    class="product-nameLink  --naked">' + product.product_name + '</a></div>\n' +
    '                            <div class="product-manufacturer"><span>' + (product.brands ? 'by ' : '') + '</span><div\n' +
    '                                     \n' +
    '                                    class="product-manufacturerLink  --naked">' + product.brands + '</div><span\n' +
    '                                    class=" --authorBadge"></span></div>\n' +
    '                            <div class="product-additionalContent">' +
    '                                <div>\n' +
    '                                    <button data-id="' + product._id + '" class="' + (removeBtn ? 'remove_favourite' : 'save_favourite') + ' gr-button gr-button--quiet u-marginTopTiny gr-button--small">' +
    (removeBtn ? 'Remove from' : 'Add to') + ' favourites' +
    '                                    </button>\n' +
    '                                </div>\n' +
    '                                <div>\n' +
    '                                </div>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </div>'
}

export function paintScannedProduct (product) {
  let html = generateProductHtml(product)
  let productElement = document.getElementById('scanned-product')
  productElement.innerHTML = html
}

export function paintFavouriteProducts (products) {
  let html = products.map(product => generateProductHtml(product, true))
  let productElement = document.getElementById('my_favourites')
  productElement.innerHTML = html
}

export function paintRecommendedProducts (products) {
  let fav = getCookieFavs()
  let html = products.map(product => generateProductHtml(product, fav.includes(product._id)))
  let productElement = document.getElementById('recommended-products')
  productElement.innerHTML = html
}

export const getCookieFavs = () => {
  let favs = getCookie('favourites')
  if (favs) {
    return favs.split(',')
  }
  return []
}
export const saveCookieFav = (id) => {
  let favs = getCookieFavs()
  if (!favs.includes(id.toString())) {
    favs.push(id)
    setCookie('favourites', '', -1)
    setCookie('favourites', favs.join(','), 1000)
  }
  return favs
}
export const removeCookieFav = (id) => {
  let favs = getCookieFavs()
  let newFavs = []
  for (let i = 0; i < favs.length; i++) {
    if (id.toString() !== favs[i]) {
      newFavs.push(favs[i])
    }
  }
  setCookie('favourites', '', -1)
  setCookie('favourites', newFavs.join(','), 1000)
  return newFavs
}

export function hasClass (element, className) {
  return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1
}

export function fetchProduct (code) {
  showLoader()
  fetch(`http://localhost:8080/api/products/${code}`, {
    credentials: 'include'
  }).then(response => response.json())
    .then(data => {
        hideLoader()
        console.log(data.product_name)
        // if (data.product_name) {
        paintScannedProduct(data)
        // } else {
        //   throw new Error('Product does not exist in our database')
        // }
      }
    )
    .catch(function (err) {
      console.log(err)
      hideLoader()
      alert('Product does not exist in our database')
    })
}

export function updateFavourites () {
  showLoader()
  fetch(`http://localhost:8080/api/favourites`, {
    method: 'PUT',
    credentials: 'include'
  }).then(response => response.json())
    .then(data => {
    })
    .catch(function () {
    })
}

export function fetchFavourites (ids) {
  showLoader()
  fetch(`http://localhost:8080/api/products?ids=${ids}`, {
    credentials: 'include'
  }).then(response => response.json())
    .then(data => {
        hideLoader()
        paintFavouriteProducts(data)
      }
    )
    .catch(function () {
      hideLoader()
    })
}

export function fetchStatistics (container) {
  showLoader()
  fetch(`http://localhost:8080/api/statistics`, {
    credentials: 'include'
  }).then(response => response.json())
    .then(data => {
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
          container.innerHTML += generateSVG(data[keys[i]], keys[i])
        }
        hideLoader()

      }
    )
    .catch(function () {
      hideLoader()
    })
}

export function setCookie (name, value, days) {
  let d = new Date()
  let multiply = 24 * 60 * days
  d.setTime(d.getTime() + multiply * 60 * 1000)
  let domain = `domain=localhost;`
  document.cookie =
    name + '=' + value + ';' + domain + 'path=/;expires=' + d.toGMTString()
}

export function getCookie (name) {
  let v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
  return v ? v[2] : null
}

export function facebookLogin () {
  FB.init({
    appId: '1958746447768376',
    cookie: true,
    xfbml: true,
    version: 'v2.8'
  })

  FB.login(function (res) {
    var d = new Date()
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000)
    let expires = `expires=${d.toUTCString}`
    document.cookie = `goreToken=${
      res.authResponse.accessToken
      };${expires};path=/`

    FB.api('/me', res => {
      document.cookie = `userId=${res.id};${expires};path=/`
      document.cookie = `userName=${res.name};${expires};path=/`
      let nameInfo = document.querySelector('.user-nav .user-nav__name')
      if (nameInfo) {
        nameInfo.innerHTML = cookieName
      }
    })
  }, {scope: 'public_profile,email,user_friends'})
}

export function getFriends (cb) {
  FB.api(`/me/friends?access_token=${getCookie('goreToken')}`, function (response) {
    cb(response)
  }, {scope: 'user_friends'})
}

export function onInit () {
  let cookieName = getCookie('userName')
  if (cookieName) {
    let nameInfo = document.querySelector('.user-nav .user-nav__name')
    if (nameInfo) {
      nameInfo.innerHTML = cookieName
    }
    //homepage
    let signIn = document.querySelector('ul.menu__list > li.menu__item:first-child > a.menu__link:first-child')
    if (signIn) {
      signIn.parentNode.removeChild(signIn)
    }
    let secondSingInButton = document.querySelector('header.header .header__wrapper .button.header__button')
    if (secondSingInButton) {
      secondSingInButton.parentNode.removeChild(secondSingInButton)
    }
  } else {
    let nameSpace = document.querySelector('.user-nav')
    if (nameSpace) {
      while (nameSpace.firstChild) {
        nameSpace.removeChild(nameSpace.firstChild)
      }
      let loginButton = document.createElement('button')
      loginButton.classList.add(
        'button',
        'login-btn',
        'button--transparent',
        'header-button'
      )
      loginButton.onclick = function () {
        facebookLogin()
      }
      loginButton.style.border = 'none'
      loginButton.innerText = 'LOGIN'
      nameSpace.appendChild(loginButton)
    }
  }
}