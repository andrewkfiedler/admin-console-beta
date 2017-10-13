import React from 'react'

import { connect } from 'react-redux'

import CircularProgress from 'material-ui/CircularProgress'

const Loader = ({className}) => (
  <CircularProgress className={className} size={200} style={{position: 'absolute', width: '100%', textAlign: 'center'}} />
)

export default connect(
)(Loader)
