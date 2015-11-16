/**
 * React component to view a stop tree cache
 * @author mattwigway
 */

import React, {Component, PropTypes} from 'react'
import StopTreeEntry from './stop-tree-entry'

export default class StopTreeViewer extends Component {
  static propTypes = {
    stopTrees: PropTypes.object,
    query: PropTypes.object
  }

  render () {
    console.log(`${this.props.stopTrees.index.length} stops in stop tree`)
    let index = Array.prototype.map.call(this.props.stopTrees.index, (off, idx) => {
      return {
        offset: off,
        y: idx / this.props.query.width | 0,
        x: idx % this.props.query.width | 0
      }
    })
    // only show pixels which are not unlinked
    .filter(o => this.props.stopTrees.data[o.offset] !== 0)

    // TODO pagination/infinite scrolling/some sort of filtering
    index = index.slice(0, Math.min(1000, index.length))

    return (<ul>
      {index.map(o =>
          <StopTreeEntry key={o.offset} offset={o.offset} x={o.x} y={o.y} stopTrees={this.props.stopTrees} />
        )}
      </ul>
    )
  }
}
