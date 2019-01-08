import 'babel-polyfill'
import { onReady, initZBRangeSlider, initScanner, scan } from './helpers'

onReady(async () => {
  let slider = document.getElementById('price-slider')
  if (slider) {
    initZBRangeSlider('price-slider', 'price-slider-label')
  }
  let scanButton = document.getElementById('scan-product')
  if (scanButton) {
    initScanner()
    scanButton.addEventListener('click', scan)
  }
})

