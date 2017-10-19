import React from 'react'

import { connect } from 'react-redux'

import { getApplications, isLoaded, getConfigurationsForApp } from '../reducer'
import Loader from '../loader/loader'
import Mount from 'react-mount'

import { disappear, appear } from '../styles.css'
import FlatButton from 'material-ui/FlatButton'
import ResetIcon from 'material-ui/svg-icons/action/history'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import DeleteAllIcon from 'material-ui/svg-icons/content/delete-sweep'
import SubIcon from 'material-ui/svg-icons/navigation/subdirectory-arrow-right'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import AddIcon from 'material-ui/svg-icons/content/add'
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
      ? <div><FlatButton label='Edit' icon={<EditIcon />} /> <FlatButton label='Reset To Defaults' icon={<ResetIcon />} /></div>
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
    <Table fixedHeader selectable={false}>
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
        }).reduce((rows, feature) => {
          let actionButton = <div>
            <FlatButton label='Add' icon={<AddIcon />} />
            {feature.configurations !== undefined ? <FlatButton label='Delete All' icon={<DeleteAllIcon />} /> : null}
          </div>
          if (feature.factory !== true) {
            actionButton = feature.configurations !== undefined
            ? <div><FlatButton label='Edit' icon={<EditIcon />} /> <FlatButton label='Reset To Defaults' icon={<ResetIcon />} /></div>
            : <FlatButton label='Customize' icon={<EditIcon />} />
          }
          rows.push(<TableRow>
            <TableRowColumn>
              <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                {feature.name}
              </div>
            </TableRowColumn>
            <TableRowColumn>{actionButton}</TableRowColumn>
          </TableRow>)
          if (feature.factory === true && feature.configurations !== undefined) {
            rows = rows.concat(feature.configurations.map((config) => {
              return (
                <TableRow style={{borderBottom: 'none'}}>
                  <TableRowColumn>
                    <div style={{display: 'inline-block', verticalAlign: 'middle', paddingLeft: 15, opacity: 0.8}}>
                      {(() => {
                        const test = config.id.split('.')
                        return test[test.length - 1]
                      })()}
                    </div>
                  </TableRowColumn>
                  <TableRowColumn>
                    <div style={{paddingLeft: 15}}><FlatButton label='Edit' icon={<EditIcon />} /> <FlatButton label='Delete' icon={<DeleteIcon />} /></div>
                  </TableRowColumn>
                </TableRow>
              )
            }))
          }
          return rows
        }, [])}
      </TableBody>
    </Table>
  )
}

const FeaturesContainer = ({configurations, application}) => {
  return (
    <div>
      <Section title='Custom'>
        <FeatureTable application={application} configurations={configurations.filter((feature) => feature.factory === false && feature.configurations !== undefined)} />
      </Section>
      <Section title='Factories'>
        <FeatureTable application={application} configurations={configurations.filter((feature) => feature.factory === true)} />
      </Section>
      <Section title='Default'>
        <FeatureTable application={application} configurations={configurations.filter((feature) => feature.factory === false && feature.configurations === undefined)} />
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
