import React from 'react'

import { connect } from 'react-redux'
import { item, appName, appVersion, textArea } from './styles.css'
import FlatButton from 'material-ui/RaisedButton'
import { Link } from 'react-router'
import Paper from 'material-ui/Paper'

let capitalizeFirstLetter = function (string) {
  if (string && string !== '') {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  return string
}

let getOldAppName = ({description, name}) => {
  var changeObj = {}

  if (description) {
    var desc = description
    var values = desc.match(/(.*)::(.*)/)
    if (values !== null) {
      if (values.length >= 3) {   // 0=whole string, 1=description, 2=display name
        changeObj.description = values[1]
        if (values[2].length > 0) { // handle empty title - use default below
          changeObj.displayName = values[2]
        }
      }
    }
  }

  if (typeof changeObj.displayName === 'undefined') {
    var tempName = name // .replace(/\./g,'');
    var names = tempName.split('-')
    var workingName = ''
    names.forEach((name) => {
      if (workingName.length > 0) {
        workingName = workingName + ' '
      }
      workingName = workingName + capitalizeFirstLetter(name)
    })
    changeObj.displayName = workingName
  }

  return changeObj.displayName
}

const Config = ({ data }) => (
  <Link to={`/application/${data.name}/description`}>
    <Paper className={item}>
      <div className={textArea}>
        <div className={appName}>{getOldAppName(data)}</div>
        <div className={appVersion}>{data.version}</div>
      </div>
      <FlatButton secondary label='Stop' onClick={(e) => e.preventDefault()} />
      <FlatButton label='Update' onClick={(e) => e.preventDefault()} />
    </Paper>
  </Link>
)

const mapStateToProps = (state) => ({
})

export default connect(
  mapStateToProps
)(Config)
