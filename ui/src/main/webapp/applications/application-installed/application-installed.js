import React from 'react'

import { connect } from 'react-redux'

import { getFeaturesForApp, getApplications } from '../reducer'

import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
import DescriptionIcon from 'material-ui/svg-icons/action/description'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import FeaturesIcon from 'material-ui/svg-icons/av/play-arrow'
import { Link as RouterLink } from 'react-router'
import ApplicationFeatures from '../application-features'
import ApplicationDescription from '../application-description'

const findApplication = (installedApplications, appName) => {
  return installedApplications.filter((app) => app.name === appName)[0]
}

const Link = ({ to, children, ...props }) => (
  <RouterLink to={to}>
    {React.cloneElement(children, props)}
  </RouterLink>
)

const Configuration = ({application}) => {
  return (
    <div>
      Configuration
    </div>
  )
}

class Application extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedIndex: 0
    }
  }
  render () {
    const {applications, applicationName, tab} = this.props
    const application = findApplication(applications, applicationName)
    const select = (index) => () => this.setState({selectedIndex: index})

    const keys = {
      description: 0,
      configuration: 1,
      features: 2
    }

    const tabs = {
      description: ApplicationDescription,
      configuration: Configuration,
      features: ApplicationFeatures
    }

    const ActiveTab = tabs[tab] || tabs.description

    return (
      <div style={{position: 'relative'}}>
        <BottomNavigation selectedIndex={keys[tab] || 0}>
          <Link to={`/application/${applicationName}/description`}>
            <BottomNavigationItem
              label='Description'
              icon={<DescriptionIcon />}
              onClick={select(0)} />
          </Link>
          <Link to={`/application/${applicationName}/configuration`} >
            <BottomNavigationItem
              label='Configuration'
              icon={<SettingsIcon />}
              onClick={select(1)} />
          </Link>
          <Link to={`/application/${applicationName}/features`} >
            <BottomNavigationItem
              label='Features'
              icon={<FeaturesIcon />}
              onClick={select(2)} />
          </Link>
        </BottomNavigation>
        <ActiveTab application={application} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  applications: getApplications(state)
})

export default connect(
  mapStateToProps,
  {
    getFeaturesForApp: getFeaturesForApp
  }
)(Application)
