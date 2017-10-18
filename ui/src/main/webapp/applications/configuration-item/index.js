import React from 'react'

import { connect } from 'react-redux'

import { getApplications, isLoaded, getConfigurationsForApp } from '../reducer'
import Loader from '../loader/loader'
import Mount from 'react-mount'

import { disappear, appear } from '../styles.css'
import FlatButton from 'material-ui/FlatButton'
import DeleteIcon from 'material-ui/svg-icons/action/history'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import Section from '../section'

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
  } from 'material-ui/Table'

const ApplicationConfiguration = ({application, loadedConfigurationsForApp, getConfigurationsForApp, configurations}) => (
  <div>
    {loadedConfigurationsForApp(application.name)
        ? <FeaturesContainer application={application} configurations={configurations(application.name)} />
        : 'not loaded'}
  </div>
)

const mapStateToProps = (state) => ({
  applications: getApplications(state),
  loadedConfigurationsForApp: (appName) => isLoaded(state, [state.get('applications').findIndex((application) => application.get('name') === appName), 'currentConfigurations']),
  configurations: (appName) => state.getIn(['applications', state.get('applications').findIndex((application) => application.get('name') === appName), 'currentConfigurations']).toJS()
})

export default connect(
  mapStateToProps, {
    getConfigurationsForApp
  }
)(ApplicationConfiguration)
