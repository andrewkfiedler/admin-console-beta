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
import CustomTable from '../table'

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
  } from 'material-ui/Table'

const FeatureTable2 = ({configurations, application}) => {
  const header = [
    <div>Name</div>,
    <div>Actions</div>
  ]
  const body = configurations.sort((a, b) => {
    if (a.name > b.name) {
      return 1
    } else if (a.name < b.name) {
      return -1
    }
    return 0
  }).map((feature) => {
    let actionButton
    if (feature.loading !== true) {
      actionButton = feature.configurations !== undefined
      ? <div><FlatButton label='Edit' icon={<EditIcon />} /> <FlatButton label='Reset To Defaults' icon={<DeleteIcon />} /></div>
      : <FlatButton label='Customize' icon={<EditIcon />} />
    }
    return [
      <div>{feature.name}</div>,
      actionButton
    ]
  })
  return (
    <div style={{maxHeight: '50vh'}}>
      <CustomTable header={header} body={body} />
    </div>
  )
}

const FeatureTable = ({configurations, application}) => {
  return (
    <Table fixedHeader selectable={false} wrapperStyle={{maxHeight: '50vh'}}>
      <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
        <TableRow>
          <TableHeaderColumn>Name</TableHeaderColumn>
          <TableHeaderColumn>Actions</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {configurations.sort((a, b) => {
          if (a.name > b.name) {
            return 1
          } else if (a.name < b.name) {
            return -1
          }
          return 0
        }).map((feature) => {
          let actionButton
          if (feature.loading !== true) {
            actionButton = feature.configurations !== undefined
            ? <div><FlatButton label='Edit' icon={<EditIcon />} /> <FlatButton label='Reset To Defaults' icon={<DeleteIcon />} /></div>
            : <FlatButton label='Customize' icon={<EditIcon />} />
          }
          return (
            <TableRow>
              <TableRowColumn>{feature.name}</TableRowColumn>
              <TableRowColumn>{actionButton}</TableRowColumn>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

const FeaturesContainer = ({configurations, application}) => {
  return (
    <div>
      <Section title='Configured'>
        <FeatureTable2 application={application} configurations={configurations.filter((feature) => feature.configurations !== undefined)} />
      </Section>
      <Section title='Defaults'>
        <FeatureTable2 application={application} configurations={configurations.filter((feature) => feature.configurations === undefined)} />
      </Section>
    </div>
  )
}

const ApplicationConfiguration = ({application, loadedConfigurationsForApp, getConfigurationsForApp, configurations}) => (
  <div>
    <Mount on={() => getConfigurationsForApp(application.name)} />
    <Loader className={loadedConfigurationsForApp(application.name) ? disappear : appear} />
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
