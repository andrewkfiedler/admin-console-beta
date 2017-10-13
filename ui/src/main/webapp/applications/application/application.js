import React from 'react'

import { connect } from 'react-redux'

import { getAllFeature } from '../reducer'
import Loader from '../loader/loader'
import Mount from 'react-mount'

import { disappear, appear } from '../styles.css'
import ApplicationInstalled from '../application-installed/application-installed'
import Paper from 'material-ui/Paper'

const Application = ({routeParams, applications, loading, onLoad}) => (
  <Paper style={{marginTop: 40, padding: 10}}>
    <div style={{position: 'relative'}}>
      <Mount on={onLoad} />
      <Loader className={loading ? appear : disappear} />
      <div className={loading ? disappear : appear}>
        {applications.filter((app) => app.name === routeParams.application).length > 0 ? <ApplicationInstalled applicationName={routeParams.application} tab={routeParams.tab} /> : 'Not installed :('}
      </div>
    </div>
  </Paper>
)

const mapStateToProps = (state) => ({
  applications: state.getIn(['applications', 'data']).toJS(),
  loading: state.getIn(['applications', 'loading'])
})

export default connect(
  mapStateToProps,
  {
    onLoad: getAllFeature
  }
)(Application)
