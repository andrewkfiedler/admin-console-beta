import 'whatwg-fetch'
import { fromJS, List } from 'immutable'

const applicationsUrl = '/admin/jolokia/read/org.codice.ddf.admin.application.service.ApplicationService:service=application-service/Applications/'
const featuresUrl = '/admin/jolokia/exec/org.codice.ddf.admin.application.service.ApplicationService:service=application-service/findApplicationFeatures/'
const configurationsUrl = '/admin/jolokia/exec/org.codice.ddf.admin.application.service.ApplicationService:service=application-service/getServices/'
const uninstallFeatureUrl = '/admin/jolokia/exec/org.apache.karaf:type=feature,name=root/uninstallFeature(java.lang.String,boolean)/'
const installFeatureUrl = '/admin/jolokia/exec/org.apache.karaf:type=feature,name=root/installFeature(java.lang.String,boolean)/'

export const getAllFeature = () => (dispatch, getState) => {
  if (!isLoaded(getState())) {
    window.fetch(applicationsUrl, { method: 'GET', credentials: 'same-origin' })
    .then((res) => res.json())
    .then((json) => {
      dispatch({ type: 'setApplications', json })
    })
  }
}

export const getFeaturesForApp = (app) => (dispatch, getState) => {
  if (!isAppFeaturesLoaded(getState(), app)) {
    window.fetch(featuresUrl + app, { method: 'GET', credentials: 'same-origin' })
    .then((res) => res.json())
    .then((json) => {
      dispatch({ type: 'setFeaturesForApp', json, app })
    })
  }
}

export const getServices = (app) => (dispatch) => {
  window.fetch(configurationsUrl + app, { method: 'GET', credentials: 'same-origin' })
    .then((res) => res.json())
    .then((json) => {
      dispatch({ type: 'setServices', json, app })
    })
}

export const uninstallFeature = (app, feature) => (dispatch) => {
  dispatch({ type: 'startLoadingFeature', app, feature })
  window.fetch(uninstallFeatureUrl + feature + '/true', { method: 'GET', credentials: 'same-origin' })
    .then((res) => res.json())
    .then((json) => {
      window.fetch(featuresUrl + app, { method: 'GET', credentials: 'same-origin' })
      .then((res) => res.json())
      .then((json) => {
        dispatch({ type: 'setFeaturesForApp', json, app })
      })
    })
}

export const installFeature = (app, feature) => (dispatch) => {
  dispatch({ type: 'startLoadingFeature', app, feature })
  window.fetch(installFeatureUrl + feature + '/true', { method: 'GET', credentials: 'same-origin' })
    .then((res) => res.json())
    .then((json) => {
      window.fetch(featuresUrl + app, { method: 'GET', credentials: 'same-origin' })
      .then((res) => res.json())
      .then((json) => {
        dispatch({ type: 'setFeaturesForApp', json, app })
      })
    })
}

export default (state = null, { type, json, app, feature }) => {
  let index, appIndex, featureIndex
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
      return fromJS(json.value)
    case 'setFeaturesForApp':
      index = state.findIndex((application) => application.get('name') === app)
      return state.setIn([index, 'currentFeatures'], fromJS(json.value))
    case 'setServices':
      return state
    case 'startLoadingFeature':
      appIndex = state.findIndex((application) => application.get('name') === app)
      featureIndex = state.getIn([appIndex, 'currentFeatures']).findIndex((otherFeature) => otherFeature.get('name') === feature)
      return state.setIn([appIndex, 'currentFeatures', featureIndex, 'loading'], fromJS(true))
    default:
      return state
  }
}

export const isLoaded = (state, path = []) => {
  const test = state.getIn(['applications'].concat(path))
  return test !== null && test !== undefined
}

export const isAppFeaturesLoaded = (state, app) => {
  const index = state.getIn(['applications']).findIndex((application) => application.get('name') === app)
  return isLoaded(state, [index, 'currentFeatures'])
}

export const isAppFeatureLoading = (state, app, feature) => {
  const appIndex = state.getIn(['applications']).findIndex((application) => application.get('name') === app)
  const featureIndex = state.getIn(['applications', appIndex, 'currentFeatures']).findIndex((otherFeature) => otherFeature.get('name') === feature)
  const loading = state.getIn(['applications', appIndex, 'currentFeatures', featureIndex, 'loading'])
  return loading !== null & loading !== undefined
}

export const getApplications = (state) => (state.getIn(['applications']) || List()).toJS()
