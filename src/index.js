import 'babel-polyfill'
import { onReady, initQuantitySlider, initScanner, changeCheckbox, scan, categoriesCheckboxHandler } from './helpers'

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
  }
})
