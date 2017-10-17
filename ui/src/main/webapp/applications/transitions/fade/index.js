import React from 'react'

import * as styles from './styles.css'
import CSSTransitionGroup from 'react-addons-css-transition-group'

export default ({ children }) => (
  <div style={{position: 'relative'}}>
    <CSSTransitionGroup transitionName={styles} transitionAppear transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
      {children}
    </CSSTransitionGroup>
  </div>
)
