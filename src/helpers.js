export const onReady = (code) => {
  document.addEventListener('DOMContentLoaded', function () {
    code()
  })
}
export const rangeSlider = () => {
  let slider = document.getElementsByClassName('range-slider')
  let range = document.getElementsByClassName('range-slider__range')
  let value = document.getElementsByClassName('range-slider__value')

  slider.each(function () {

    value.each(function () {
      // let value = $(this).prev().attr('value')
      // $(this).html(value)
    })
    range.addEventListener('input', function () {
      // $(this).next(value).html(this.value)
    })
  })
}
// THIS IS THE RANGE SLIDER LOGIC DO NOT CHANGE !!
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
  let min = parseFloat(slider.getAttribute('se-min'))
  let max = parseFloat(slider.getAttribute('se-max'))

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
export const initZBRangeSlider = (id, label) => {
  let newRangeSlider = new ZBRangeSlider(id)
  console.log('init')
  newRangeSlider.onChange = function (min, max) {
    console.log('init')

    console.log(min, max, this)
    document.getElementById(label).innerHTML = 'Price   Min: ' + min + ' Max: ' + max
  }

  newRangeSlider.didChanged = function (min, max) {
    console.log('init3')

    console.log(min, max, this)
    document.getElementById(label).innerHTML = 'Price  Min: ' + min + ' Max: ' + max
  }
}
