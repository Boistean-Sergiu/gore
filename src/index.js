import 'babel-polyfill'
import {
  onReady,
  initZBRangeSlider,
  changeCheckbox,
  categoriesCheckboxHandler,
  initScanner,
  scan,
  hasClass,
  saveLocalStorageFav,
  fetchFavourites, getLocalStorageFavs, removeLocalStorageFav
} from './helpers'

onReady(async () => {
  let filters = {
    minQuantity: 0,
    maxQuantity: 5000,
    categories: {
      food: true,
      snacks: true,
      beverages: true,
      sweets: true,
      dairies: true,
      meats: true,
      cereals: true,
    }
  }
  //initPriceSlider('price-slider', 'price-slider-label', filters)
  let quantitySlider = document.getElementById('range-slider')
  if (quantitySlider) {
    initQuantitySlider('range-slider', 'quantity-slider-label', filters)
  }
  categoriesCheckboxHandler(filters)

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
