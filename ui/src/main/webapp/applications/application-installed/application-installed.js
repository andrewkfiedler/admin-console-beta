import React from 'react'

import { connect } from 'react-redux'

import { getFeature } from '../reducer'

import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
import DescriptionIcon from 'material-ui/svg-icons/action/description'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import FeaturesIcon from 'material-ui/svg-icons/av/play-arrow'
import { Link as RouterLink } from 'react-router'
import Mount from 'react-mount'

const findApplication = (installedApplications, appName) => {
  return installedApplications.filter((app) => app.name === appName)[0]
}

const Link = ({ to, children, ...props }) => (
  <RouterLink to={to}>
    {React.cloneElement(children, props)}
  </RouterLink>
)

const Section = ({label, value}) => {
  let valElement = <div>{value}</div>
  if (value.constructor === Array) {
    valElement = value.map((val) => {
      return <RouterLink to={`/application/${val}/description`}><div>{val}</div></RouterLink>
    })
  }

  return (
    <div style={{padding: 10}}>
      <div style={{fontSize: 20}}>{label}</div>
      {valElement}
    </div>
  )
}

const Description = ({application}) => {
  return (
    <div>
      <Section label='Description' value={application.description} />
      <Section label='Version' value={application.version} />
      <Section label='State' value={application.state} />
      <Section label='Dependencies' value={application.parents} />
      <Section label='Child Dependencies' value={application.dependencies} />
    </div>
  )
}

const Configuration = ({application}) => {
  return (
    <div>
      Configuration
    </div>
  )
}

const Features = ({application, onLoad}) => {
  return (
    <div>
      <Mount on={() => onLoad(application.name)} />
      Features
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
    const {applications, applicationName, tab, onLoad} = this.props
    const application = findApplication(applications, applicationName)
    const select = (index) => () => this.setState({selectedIndex: index})

    const keys = {
      description: 0,
      configuration: 1,
      features: 2
    }

    const tabs = {
      description: Description,
      configuration: Configuration,
      features: Features
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
        <ActiveTab application={application} onLoad={onLoad} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  applications: state.getIn(['applications', 'data']).toJS()
})

export default connect(
  mapStateToProps,
  {
    onLoad: getFeature
  }
)(Application)
