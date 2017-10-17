import React from 'react'

import { connect } from 'react-redux'

import { getAllFeature, getApplications, isLoaded } from '../reducer'
import Loader from '../loader/loader'
import Mount from 'react-mount'

import { disappear, appear } from '../styles.css'
import ApplicationInstalled from '../application-installed/application-installed'
import Paper from 'material-ui/Paper'
import Fade from '../transitions/fade'

const Application = ({routeParams, applications, loaded, onLoad}) => (
  <Fade>
    <Paper key={routeParams.application + loaded} style={{marginTop: 40, padding: 10}}>
      <div style={{position: 'relative'}}>
        <Mount on={onLoad} />
        <Loader className={loaded ? disappear : appear} />
        <div className={loaded ? appear : disappear}>
          {loaded ? applications.filter((app) => app.name === routeParams.application).length > 0 ? <ApplicationInstalled applicationName={routeParams.application} tab={routeParams.tab} /> : 'Not installed :(' : null}
        </div>
      </div>
    </Paper>
  </Fade>
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
)(Application)
