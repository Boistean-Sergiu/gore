import 'babel-polyfill'
import { onReady, initZBRangeSlider } from './helpers'

onReady(async () => {
  initZBRangeSlider('price-slider', 'price-slider-label')

  // let response = await fetch(`http://localhost:8080/api/products/${result.codeResult.code}`)
  // console.log(response)
})
