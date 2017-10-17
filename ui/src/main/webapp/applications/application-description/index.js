import React from 'react'

import { connect } from 'react-redux'

import { Link as RouterLink } from 'react-router'
import Section from '../Section'

const ApplicationFeatures = ({application}) => (
  <div>
    <Section title='Description'>
      {application.description}
    </Section>
    <Section title='Version'>
      {application.version}
    </Section>
    <Section title='State'>
      {application.state}
    </Section>
    <Section title='Dependencies'>
      {application.parents.sort().map((val, i) => {
        return <RouterLink key={i} to={`/application/${val}/description`}><div>{val}</div></RouterLink>
      })}
    </Section>
    <Section title='Child Dependencies'>
      {application.dependencies.sort().map((val, i) => {
        return <RouterLink key={i} to={`/application/${val}/description`}><div>{val}</div></RouterLink>
      })}
    </Section>
  </div>
)

export default connect()(ApplicationFeatures)
