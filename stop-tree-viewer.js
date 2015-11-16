/**
 * React component to view a stop tree cache
 * @author mattwigway
 */

import React, {Component, PropTypes} from 'react'
import StopTreeEntry from './stop-tree-entry'

export default class StopTreeViewer extends Component {
  static propTypes = {
    stopTrees: PropTypes.object
  }

  render () {
    console.log(`${this.props.stopTrees.index.length} stops in stop tree`)
    // only show pixels which are attached to stops
    let index = this.props.stopTrees.index.filter(off => this.props.stopTrees.data[off] !== 0)
    index = index.slice(0, Math.min(1000, index.length))

    return (<ul>
      {Array.prototype.map.call (index, off =>
          <StopTreeEntry key={off} offset={off} stopTrees={this.props.stopTrees} />
        )}
      </ul>
    )
  }
}
