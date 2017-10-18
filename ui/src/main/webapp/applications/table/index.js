import React from 'react'
import muiThemeable from 'material-ui/styles/muiThemeable'

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'separate !important',
    borderSpacing: 0
  },
  thead: {
    background: 'inherit',
    textAlign: 'left'
  },
  theadHeaderCells: {
    background: 'inherit',
    padding: 10,
    borderBottom: '1px solid grey',
    zIndex: 1,
    transform: 'translate3d(0px, 0px, 0px)',
    position: 'relative'
  },
  cells: {
    padding: 10
  },
  wrapper: {
    position: 'relative',
    overflow: 'auto',
    background: 'inherit',
    height: '100%',
    width: '100%'
  }
}

class Table extends React.Component {
  constructor (props) {
    super(props)
    this.tick = this.tick.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }
  componentDidMount () {
    this.wrapper.onscroll = this.tick
    this.tick()
  }
  tick () {
    this.wrapper.querySelectorAll('th').forEach((element) => {
      element.style.transform = 'translate3d(0, ' + this.wrapper.scrollTop + 'px, 0)'
    })
    if (this.wrapper.parentElement.clientHeight < this.wrapper.clientHeight) {
      this.wrapper.style.height = this.wrapper.parentElement.clientHeight + 'px'
    }
  }
  render () {
    const {header, body, muiTheme} = this.props
    styles.theadHeaderCells.background = muiTheme.palette.canvasColor
    styles.thead.background = muiTheme.palette.canvasColor
    return (
      <div ref={(wrapper) => { this.wrapper = wrapper }} style={styles.wrapper}>
        <table style={styles.table}>
          <thead ref={(thead) => { this.thead = thead }} style={styles.thead}>
            <tr>{
              header.map((element) =>
                <th style={styles.theadHeaderCells}>
                  {element}
                </th>)
            }
            </tr>
          </thead>
          <tbody ref={(tbody) => { this.tbody = tbody }}>
            {
              body.map((row) =>
                <tr>{row.map((cell) =>
                  <td style={styles.cells}>
                    {cell}
                  </td>)}
                </tr>)
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default muiThemeable()(Table)
