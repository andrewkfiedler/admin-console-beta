import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import PaletteIcon from 'material-ui/svg-icons/image/palette'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import HomeIcon from 'material-ui/svg-icons/action/home'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import Drawer from 'material-ui/Drawer'

const capitalizeFirstLetter = function (string) {
  if (string && string !== '') {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  return string
}

const humanizeRouteName = (name) => {
  var tempName = name // .replace(/\./g,'');
  var names = tempName.split('-')
  var workingName = ''
  names.forEach((name) => {
    if (workingName.length > 0) {
      workingName = workingName + ' '
    }
    workingName = workingName + capitalizeFirstLetter(name)
  })
  return workingName
}

const getRouteName = (path) => {
  const parts = path.split('/')
  parts.shift()
  return parts.map((part) => humanizeRouteName(part)).join(' > ')
}

let AdminPalette

if (process.env.NODE_ENV === 'production') {
  AdminPalette = () => null
}

if (process.env.NODE_ENV !== 'production') {
  AdminPalette = require('react-swatch/admin-palette').default
}

import { updateThemeColor, setThemePreset } from './actions'
import { getTheme } from './reducer'

const isInIframe = () => {
  return window !== window.top
}

const getAppBarStyle = () => (
  isInIframe() ? { borderRadius: '4px 4px 0px 0px' } : {}
)

class AppBarView extends Component {
  constructor (props) {
    super(props)
    this.state = { isArtDrawerOpen: false }
  }

  openArtDrawer () {
    this.setState({ isArtDrawerOpen: true })
  }

  closeArtDrawer () {
    this.setState({ isArtDrawerOpen: false })
  }

  render () {
    const {
      theme,
      updateColor,
      setThemePreset
    } = this.props
    const {
      isArtDrawerOpen
    } = this.state

    return (
      <div>
        <AppBar
          style={getAppBarStyle()}
          title={getRouteName(this.props.location.pathname)}
          iconElementLeft={
            <IconButton containerElement={<Link to='/' />}>
              <HomeIcon />
            </IconButton>
          }
          iconElementRight={
            (process.env.NODE_ENV !== 'production') ? (
              <IconButton onTouchTap={() => this.openArtDrawer()}>
                <PaletteIcon />
              </IconButton>
            ) : null
          }
        />
        <Drawer width={281} openSecondary open={isArtDrawerOpen}>
          <IconButton onTouchTap={() => this.closeArtDrawer()}>
            <CloseIcon />
          </IconButton>
          <AdminPalette theme={theme} updateColor={updateColor} setThemePreset={setThemePreset} />
        </Drawer>
      </div>
    )
  }
}

export default connect((state) => ({
  theme: getTheme(state)
}), (dispatch) => ({
  updateColor: (path) => (color) => {
    dispatch(updateThemeColor(path, color))
    window.forceUpdateThemeing()
  },
  setThemePreset: (themeName) => {
    dispatch(setThemePreset(themeName))
    window.forceUpdateThemeing()
  }
}))(AppBarView)
