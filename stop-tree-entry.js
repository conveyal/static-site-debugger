/**
 * Show one stop of a stop tree cache
 */

import React, {Component, PropTypes} from 'react'

export default class StopTreeEntry extends Component {
  static propTypes = {
    stopTrees: PropTypes.object,
    offset: PropTypes.number
  }

  constructor (props) {
    super(props)
    this.state = { expanded: false  }
  }

  toggle () {
    let state = Object.assign({}, this.state)
    state.expanded = !state.expanded
    this.setState(state)
  }

	render () {
    let offset = this.props.offset
    let nStops = this.props.stopTrees.data[offset++]

    let title = <a name={offset} onClick={e => { this.toggle(); return false }} >{offset} ({nStops} reachable stops)</a>  

    if (this.state.expanded) {
      // parse the stop tree
      let stopAtDistance = []

      for (let i = 0; i < nStops; i++) {
        stopAtDistance.push({
          stopId: this.props.stopTrees.data[offset++],
          distance: this.props.stopTrees.data[offset++]
        })
      }

      return (
        <li>
          {title}
          <table>
            <thead>
              <th>Stop ID</th><th>Distance</th>
            </thead>
            <tbody>
              {
                stopAtDistance.map(sd =>
                  <tr key={offset + '_' + sd.stopId}>
                    <td>{sd.stopId}</td>
                    <td>{sd.distance}</td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </li>
      )
    }
    else {
      return <li>{title}</li>
    }
  }
}