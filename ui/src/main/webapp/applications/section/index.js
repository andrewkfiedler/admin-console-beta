import React from 'react'

export default ({title, children, style}) => {
  return (
    <div style={{...style, ...{padding: 10}}}>
      <div style={{fontSize: 20}}>{title}</div>
      {children}
    </div>
  )
}
