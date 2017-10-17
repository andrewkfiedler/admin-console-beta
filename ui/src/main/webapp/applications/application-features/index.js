import React from 'react'

import { connect } from 'react-redux'

import { getApplications, isLoaded, getFeaturesForApp, installFeature, uninstallFeature, isAppFeatureLoading } from '../reducer'
import Loader from '../loader/loader'
import Mount from 'react-mount'

import { disappear, appear } from '../styles.css'
import FlatButton from 'material-ui/FlatButton'
import InstallIcon from 'material-ui/svg-icons/av/play-arrow'
import UninstallIcon from 'material-ui/svg-icons/av/stop'
import LinearProgress from 'material-ui/LinearProgress'
import Section from '../section'

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
  } from 'material-ui/Table'

const FeatureTable = ({features, application, installFeature, uninstallFeature}) => {
  return (
    <Table fixedHeader selectable={false}>
      <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
        <TableRow>
          <TableHeaderColumn>Name</TableHeaderColumn>
          <TableHeaderColumn>Actions</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {features.sort((a, b) => {
          if (a.name > b.name) {
            return 1
          } else if (a.name < b.name) {
            return -1
          }
          return 0
        }).map((feature) => {
          let actionButton = <div style={{textAlign: 'center'}}>
            {feature.status === 'Installed' ? 'Uninstalling' : 'Installing'}
            <LinearProgress mode='indeterminate' />
          </div>
          if (feature.loading !== true) {
            actionButton = feature.status === 'Installed'
            ? <FlatButton label='Uninstall' icon={<UninstallIcon />} onClick={() => uninstallFeature(application.name, feature.name)} />
            : <FlatButton label='Install' icon={<InstallIcon />} onClick={() => installFeature(application.name, feature.name)} />
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

const FeaturesContainer = ({features, application, installFeature, uninstallFeature}) => {
  return (
    <div>
      <Section title='Installed'>
        <FeatureTable application={application} features={features.filter((feature) => feature.status === 'Installed')} uninstallFeature={uninstallFeature} installFeature={installFeature} />
      </Section>
      <Section title='Uninstalled'>
        <FeatureTable application={application} features={features.filter((feature) => feature.status !== 'Installed')} uninstallFeature={uninstallFeature} installFeature={installFeature} />
      </Section>
    </div>
  )
}

const ApplicationFeatures = ({application, loadedFeaturesForApp, getFeaturesForApp, features, uninstallFeature, installFeature}) => (
  <div>
    <Mount on={() => getFeaturesForApp(application.name)} />
    <Loader className={loadedFeaturesForApp(application.name) ? disappear : appear} />
    {loadedFeaturesForApp(application.name)
        ? <FeaturesContainer application={application} features={features(application.name)} uninstallFeature={uninstallFeature} installFeature={installFeature} />
        : 'not loaded'}
  </div>
)

const mapStateToProps = (state) => ({
  applications: getApplications(state),
  loadedFeaturesForApp: (appName) => isLoaded(state, [state.get('applications').findIndex((application) => application.get('name') === appName), 'currentFeatures']),
  features: (appName) => state.getIn(['applications', state.get('applications').findIndex((application) => application.get('name') === appName), 'currentFeatures']).toJS()
})

export default connect(
  mapStateToProps, {
    getFeaturesForApp,
    uninstallFeature,
    installFeature,
    isAppFeatureLoading
  }
)(ApplicationFeatures)
