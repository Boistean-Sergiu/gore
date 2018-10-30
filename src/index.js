import 'babel-polyfill'
import { onReady } from './helpers'
import Quagga from 'quagga'

onReady(() => {
  let state = {
    inputStream: {
      size: 800,
      singleChannel: false
    },
    locator: {
      patchSize: 'medium',
      halfSample: true
    },
    decoder: {
      readers: [{
        format: 'code_128_reader',
        config: {}
      }]
    },
    locate: true,
    src: null
  }
  Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: document.querySelector('#preview')    // Or '#yourElement' (optional)
    },
    decoder: {
      readers: ['code_128_reader']
    }
  }, function (err) {
    if (err) {
      console.log(err)
      return
    }
    console.log('Initialization finished. Ready to start')
    Quagga.start()
  })
  Quagga.onProcessed(function (result) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
      drawingCanvas = Quagga.canvas.dom.overlay,
      area

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')))
        result.boxes.filter(function (box) {
          return box !== result.box
        }).forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: 'green', lineWidth: 2})
        })
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: '#00F', lineWidth: 2})
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3})
      }

      if (state.inputStream.area) {
        area = calculateRectFromArea(drawingCanvas, state.inputStream.area)
        drawingCtx.strokeStyle = '#0F0'
        drawingCtx.strokeRect(area.x, area.y, area.width, area.height)
      }
    }
  })
  Quagga.onDetected(async function (result) {
    let response = await fetch(`http://localhost:8080/api/products/${result.codeResult.code}`)
    console.log(response)
    alert(result.codeResult.code)
  })

})