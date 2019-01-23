import 'babel-polyfill'
import {
  onReady,
  initZBRangeSlider,
  initScanner,
  scan,
  hasClass,
  saveLocalStorageFav,
  fetchFavourites, getLocalStorageFavs, removeLocalStorageFav
} from './helpers'

onReady(async () => {
  let slider = document.getElementById('price-slider')
  if (slider) {
    initZBRangeSlider('price-slider', 'price-slider-label')
  }
  let scanButton = document.getElementById('scan-product')
  if (scanButton) {
    initScanner()
    scanButton.addEventListener('click', scan)
    fetchFavourites(getLocalStorageFavs())
  }
  document.addEventListener('click', function (e) {
    if (hasClass(e.target, 'save_favourite')) {
      fetchFavourites(saveLocalStorageFav(e.target.dataset.id))
    } else if (hasClass(e.target, 'remove_favourite')) {
      fetchFavourites(removeLocalStorageFav(e.target.dataset.id))
    }
  })
})
