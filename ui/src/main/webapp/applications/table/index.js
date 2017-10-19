import React from 'react'
import muiThemeable from 'material-ui/styles/muiThemeable'

const topCover = 'linear-gradient(white 80px, rgba(255,255,255,0))'
const bottomCover = 'linear-gradient(rgba(255,255,255,0), white 70%) 0 100%'
const topShadow = 'radial-gradient(farthest-side at 50% 0%, rgba(0,0,0,.2), rgba(0,0,0,0))'
const bottomShadow = 'radial-gradient(farthest-side at 50% 100%, rgba(0,0,0,.2), rgba(0,0,0,0)) 0 100%'

const scrollHint = {
  background: `${topCover} 0 0/100% 40px no-repeat local, ${bottomCover}/100% 40px no-repeat local, ${topShadow} 0 0/100% 14px no-repeat, ${bottomShadow}/100% 14px no-repeat`
}

const getScrollHint = ({topOffset}) => {
  return `${topCover} 0 ${topOffset}/100% 40px no-repeat local, ${bottomCover}/100% 40px no-repeat local, ${topShadow} 0 ${topOffset}/100% 14px no-repeat, ${bottomShadow}/100% 14px no-repeat`
}

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
    ...scrollHint,
    ...{
      position: 'relative',
      overflow: 'auto',
      height: '100%',
      width: '100%'
    }
  }
}

class Table extends React.Component {
  constructor (props) {
    super(props)
    this.tick = this.tick.bind(this)
    this.calculateScrollHint = this.calculateScrollHint.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }
  componentDidMount () {
    this.wrapper.onscroll = this.tick
    this.tick()
    this.calculateScrollHint()
  }
  componentDidUpdate () {
    this.tick()
    this.calculateScrollHint()
  }
  calculateScrollHint () {
    const background = getScrollHint({topOffset: this.thead.clientHeight + 'px'})
    this.wrapper.style.background = background
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
                <th style={{...styles.theadHeaderCells, width: (100 / header.length) + '%'}}>
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
