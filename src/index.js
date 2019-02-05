import 'babel-polyfill'
import {
  onReady,
  initQuantitySlider,
  initScanner,
  scan,
  hasClass,
  saveLocalStorageFav,
  fetchFavourites, getLocalStorageFavs, removeLocalStorageFav, getRecommendations
} from './helpers'

onReady(async () => {
  let filters = {
    minQuantity: 0,
    maxQuantity: 5000,
    country: 'all',
    packages: 'all',
    nutrition: 'all',
    fat: 'all',
    salt: 'all',
    sugar: 'all',
    sfat: 'all'
  }
  //initPriceSlider('price-slider', 'price-slider-label', filters)
  let quantitySlider = document.getElementById('range-slider')
  if (quantitySlider) {
    initQuantitySlider('range-slider', 'quantity-slider-label', filters)
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
  document.addEventListener('change', function (e) {
      if (hasClass(e.target, 'category-checkbox')) {
        filters.categories[e.target.dataset.category] = !filters.categories[e.target.dataset.category]
        getRecommendations(filters)
      } else if (hasClass(e.target, 'countries_select')) {
        filters.country = e.target.value
        getRecommendations(filters)
      } else if (hasClass(e.target, 'package_select')) {
        filters.packages = e.target.value
        getRecommendations(filters)
      } else if (hasClass(e.target, 'nutrition_select')) {
        filters.nutrition = e.target.value
        getRecommendations(filters)
      } else if (hasClass(e.target, 'fat_select')) {
        filters.fat = e.target.value
        getRecommendations(filters)
      } else if (hasClass(e.target, 'salt_select')) {
        filters.salt = e.target.value
        getRecommendations(filters)
      } else if (hasClass(e.target, 'sugar_select')) {
        filters.sugar = e.target.value
        getRecommendations(filters)
      } else if (hasClass(e.target, 'sfat_select')) {
        filters.sfat = e.target.value
        getRecommendations(filters)
      }
    }
  )
})

