import 'whatwg-fetch'
import { fromJS } from 'immutable'

const applicationsUrl = '/admin/jolokia/read/org.codice.ddf.admin.application.service.ApplicationService:service=application-service/Applications/'
const featuresUrl = '/admin/jolokia/exec/org.codice.ddf.admin.application.service.ApplicationService:service=application-service/findApplicationFeatures/'
const configurationsUrl = '/admin/jolokia/exec/org.codice.ddf.admin.application.service.ApplicationService:service=application-service/getServices/'

export const getAllFeature = () => (dispatch) => {
  dispatch({ type: 'loadingApplications' })
  window.fetch(applicationsUrl, { method: 'GET', credentials: 'same-origin' })
    .then((res) => res.json())
    .then((json) => {
      dispatch({ type: 'setApplications', json })
    })
}

export const getFeature = (app) => (dispatch) => {
  dispatch({ type: 'loadingFeatures' })
  window.fetch(featuresUrl + app, { method: 'GET', credentials: 'same-origin' })
    .then((res) => res.json())
    .then((json) => {
      dispatch({ type: 'setFeatures', json, app })
    })
}

export const getServices = (app) => (dispatch) => {
  dispatch({ type: 'loadingServices' })
  window.fetch(configurationsUrl + app, { method: 'GET', credentials: 'same-origin' })
    .then((res) => res.json())
    .then((json) => {
      dispatch({ type: 'setServices', json, app })
    })
}

export default (state = fromJS({ loading: true, data: [] }), { type, json, app }) => {
  let intermediateState, index
  switch (type) {
    case 'setApplications':
      json.value.sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1
        } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1
        }
        return 0
      })
      json.value.forEach((app) => {
        app.currentFeatures = {
          loading: true,
          data: []
        }
      })
      intermediateState = state.set('data', fromJS(json.value))
      return intermediateState.set('loading', false)
    case 'setFeatures':
      index = state.get('data').findIndex((application) => application.get('name') === app)
      intermediateState = state.setIn(['data', index, 'currentFeatures', 'data'], fromJS(json.value))
      return intermediateState.setIn(['data', index, 'currentFeatures', 'loading'], false)
    case 'setServices':
      return state
    case 'loadingApplications':
      return state.set('loading', true)
    case 'loadingFeatures':
      index = state.get('data').findIndex((application) => application.get('name') === app)
      return state.setIn(['data', index, 'currentFeatures', 'loading'], true)
    default:
      return state
  }
}
