import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'

import Layout from './Layout'
import Home from 'pages/Home'
import NoMatch from 'pages/NoMatch'
import { observer, inject } from 'mobx-react'
import { fetchLatest } from 'lib/api'

export interface RouteProps {
  main: any
}

export default class Routes extends React.Component<RouteProps, {}> {
  public render() {
    return (
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/block/:height" component={getComponent('DetailedStatistics')} />
          <Route exact path="/hashes/:hash" component={getComponent('DetailedStatistics')} />
          <Route component={getComponent('NoMatch')} />
        </Switch>
      </Layout>
    )
  }
}

function getComponent(page) {
  return Loadable({
    loader: () => System.import(`pages/${page}`),
    loading() {
      return <div> Loading </div>
    }
  })
}
