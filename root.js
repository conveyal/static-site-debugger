/** main entry point for app */

import 'isomorphic-fetch'
import React, {Component} from 'react'
import Browsochrones from 'browsochrones'
import {Tabs, TabList, Tab, TabPanel} from 'react-tabs'
import StopTreeViewer from './stop-tree-viewer'
import OriginView from './origin-view'

export default class Root extends Component {
  constructor () {
    super()
    this.construct()
  }

  /** put most of the constructor in a separate function so babel doesn't complain about "this before super()" */
  construct () {
    // load the data specified on the command line
    console.log(`loading stop trees`)
    // get the stop trees
    this.baseUrl = 'http://localhost:4567'
    console.log(`connecting to ${this.baseUrl}`)

    this.bc = new Browsochrones()

    fetch(`${this.baseUrl}/query.json`)
    .then(query => query.json())
    .then(query => {
      this.bc.setQuery(query)
      console.log('retrieved query')

      fetch(`${this.baseUrl}/stop_trees.dat`)
        .then(data => data.arrayBuffer())
        .then(data => {
          console.log('retrieved stop trees')
          this.bc.setStopTrees(data)
          this.setState({ query: this.bc.query, stopTrees: this.bc.stopTrees })
        })
    })
  }

  render () {
    console.log(Tab)

    if (this.state == null || this.state.stopTrees == null) {
      return <div>loading</div>
    }

    return (
      <Tabs>
        <TabList>
          <Tab>Stop Trees</Tab>
          <Tab>Origin</Tab>
        </TabList>

        <TabPanel>
          <StopTreeViewer stopTrees={this.state.stopTrees} query={this.state.query} />
        </TabPanel>

        <TabPanel>
        <div>
          <input placeholder='x,y' onBlur={text => {
            let [x, y] = text.target.value.split(',')
            if (x !== undefined && y !== undefined) {
              let state = Object.assign({}, this.state)
              state.x = x | 0
              state.y = y | 0
              this.setState(state)
            }
          }} />
          </div>

          {(this.state != null && this.state.x != null && this.state.y != null ? <OriginView x={this.state.x} y={this.state.y} baseUrl={this.baseUrl} browsochrones={this.bc}   /> : <div>Enter an origin</div>)}
        </TabPanel>
      </Tabs>
      )
  }
}
