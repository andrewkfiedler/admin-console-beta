import React from 'react'

import { connect } from 'react-redux'

import { getAllFeature } from './reducer'

import CircularProgress from 'material-ui/CircularProgress'
import Mount from 'react-mount'
import { disappear, appear } from './styles.css'
import ApplicationItem from './application-item/application-item'

const Applications = ({ applications, onLoad, loading }) => (
  <div>
    <Mount on={onLoad} />
    <CircularProgress className={loading ? appear : disappear} style={{position: 'absolute'}} />
    <div className={loading ? disappear : appear}>
      {applications.map((app, i) => <ApplicationItem key={i} data={app} />)}
    </div>
  </div>
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
)(Applications)
