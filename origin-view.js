/**
 * Display an origin
 * @author mattwigway
 */

import React, {Component, PropTypes} from 'react'
import 'isomorphic-fetch'

export default class OriginView extends Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    browsochrones: PropTypes.object,
    baseUrl: PropTypes.string
  }

  componentDidMount () {
    fetch(`${this.props.baseUrl}/${this.props.x}/${this.props.y}.dat`)
      .then(res => res.arrayBuffer())
      .then(res => {
        let bc = this.props.browsochrones
        bc.setOrigin(res, this.props.x, this.props.y)
        this.setState(Object.assign({ origin: bc.origin }, this.state))
      })  
  }

  renderNonTransitTimes (scaledCanvas) {
    if (scaledCanvas == null) return // why is this happening?

    // render non-transit times to a small canvas, then scale up
    let canvas = document.createElement('canvas')
    canvas.width = canvas.height = this.size
    let ctx = canvas.getContext('2d')
    let dat = ctx.createImageData(this.size, this.size)

    dat.data.fill(255) // make everything opaque

    for (let pixel = 0; pixel < this.size * this.size; pixel++) {
      dat.data.fill(this.state.origin.data[pixel + 1] * 255 / 30 | 0, pixel * 4, pixel * 4 + 4)
    }
    ctx.putImageData(dat, 0, 0)

    let scaledCtx = scaledCanvas.getContext('2d')
    scaledCtx.scale(8, 8)
    scaledCtx.drawImage(canvas, 0, 0)
  }

  render () {
    if (this.state == null || this.state.origin == null) return <span>loading...</span>

    this.size = this.state.origin.radius * 2 + 1 | 0

    // use map from array not typedarray so we can return an object
    let stopsWithTimes = Array.prototype.map.call(this.state.origin.index, (off, idx) => {
      return { offset: off, stopId: idx }
    })
    // must be reachable at at least one time
    .map(o => {
      let sum = 0
      let count = 0
      let times = []
      for (let i = 0, time = 0; i < this.state.origin.nMinutes; i++) {
        time += this.state.origin.data[o.offset + i * 2]
        if (time > 0) {
          sum += time
          count++
          times.push(time / 60 | 0)
        }
      }
      
      o.avg = sum / count / 60 | 0
      o.times = times
      return o
    })
    .filter(o => o.times.length > 0)

    return (
      <div>
        <canvas width={this.size * 8} height={this.size * 8} ref={c => this.renderNonTransitTimes(c)} style={{imageRendering: 'pixelated'}}></canvas>
        <ul>
          {stopsWithTimes.map(swt =>
            <li key={swt.stopId}>{swt.stopId} <b>{swt.avg}</b>&nbsp;
              {swt.times.map((t, i) => <span key={i}>{t} </span>)}
            </li>
          )}
        </ul>
      </div>
    )
  }
}