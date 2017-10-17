import React from 'react'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
import { Router, hashHistory } from 'react-router'

import store from './store'
import client from './client'
import Ldap from './wizards/ldap'
import Sources from './wizards/sources'
import { Home } from './home'
import Wcpm from './security/wcpm'
import Config from './config'
import Application from './applications/application/application'

import ddfSources from 'ddf-sources'
import Backdrop from 'components/Backdrop'
import AdminAppBar from 'admin-app-bar'
import GraphiQL from 'admin-graphiql'
import DevTools from 'admin-redux-devtools'
import MuiThemeProvider from 'admin-app-bar/MuiThemeProvider'

import fonts from 'webpack-fonts'

import Fade from './applications/transitions/fade'

const App = ({ children, location }) => (
  <Provider store={store}>
    <ApolloProvider client={client}>
      <MuiThemeProvider>
        <div className={fonts.roboto}>
          <Backdrop>
            <AdminAppBar location={location} />
            <div style={{ maxWidth: '100%', width: 960, margin: '0 auto', padding: '0 20px' }}>
              <Fade>
                {children}
              </Fade>
            </div>
          </Backdrop>
          <DevTools />
        </div>
      </MuiThemeProvider>
    </ApolloProvider>
  </Provider>
)

export const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Home },
  childRoutes: [
    { path: 'ldap', component: Ldap },
    { path: 'sources', component: Sources(ddfSources) },
    { path: 'web-context-policy-manager', component: Wcpm },
    { path: 'graphiql', component: GraphiQL },
    { path: 'config', component: Config },
    { path: 'application/:application/:tab', component: Application }
  ]
}

export default () => (
  <Router history={hashHistory} routes={routes} />
)
