import React from 'react'

import { connect } from 'react-redux'

import { getAllFeature, isLoaded, getApplications } from './reducer'

import CircularProgress from 'material-ui/CircularProgress'
import Mount from 'react-mount'
import * as styles from './styles.css'
import ApplicationItem from './application-item/application-item'
import Fade from './transitions/fade'

const Applications = ({ applications, onLoad, loaded }) => (
  <div>
    <Mount on={onLoad} />
    <CircularProgress className={loaded ? styles.disappear : styles.appear} style={{position: 'absolute'}} />
    <Fade>
      {loaded ? applications.map((app, i) => <ApplicationItem key={i} data={app} />) : null}
    </Fade>
  </div>
)

const mapStateToProps = (state) => ({
  applications: getApplications(state),
  loaded: isLoaded(state)
})

export default connect(
  mapStateToProps,
  {
    onLoad: getAllFeature
  }
)(Applications)
