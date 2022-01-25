const courseHelper = require('./helpers/courses')
const cycleHelper = require('./helpers/cycles')
const locationHelper = require('./helpers/locations')

const _ = require('lodash')

module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {}

  /* ------------------------------------------------------------------
  utility function to return true or false
  example: {{ 'yes' | falsify }}
  outputs: true
  ------------------------------------------------------------------ */
  filters.falsify = (input) => {
    if (_.isNumber(input)) return input
    else if (input == false) return false
    if (_.isString(input)){
      const truthyValues = ['yes','true']
      const falsyValues = ['no', 'false']
      if (truthyValues.includes(input.toLowerCase())) return true
      else if (falsyValues.includes(input.toLowerCase())) return false
    }
    return input
  }

  /* ------------------------------------------------------------------
  utility function to get an error for a component
  example: {{ errors | getErrorMessage('title') }}
  outputs: "Enter a title"
  ------------------------------------------------------------------ */
  filters.getErrorMessage = function (array, fieldName) {
    if (!array || !fieldName) {
      return null
    }

    const error = array.filter((obj) =>
      obj.fieldName === fieldName
    )[0]

    return error
  }

  /* ------------------------------------------------------------------
  utility function to get the age range label
  example: {{ '5_to_11' | getAgeRangeLabel }}
  outputs: "5 to 11"
  ------------------------------------------------------------------ */
  filters.getAgeRangeLabel = (ageRange) => {
    let label = ageRange
    label = courseHelper.getAgeRangeLabel(ageRange)
    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the funding type label
  example: {{ 'fee' | getFundingTypeLabel }}
  outputs: "Fee paying (no salary)"
  ------------------------------------------------------------------ */
  filters.getFundingTypeLabel = (fundingType) => {
    let label = fundingType
    label = courseHelper.getFundingTypeLabel(fundingType)
    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the study mode label
  example: {{ 'both' | getStudyModeLabel }}
  outputs: "Full time or part time"
  ------------------------------------------------------------------ */
  filters.getStudyModeLabel = (studyMode) => {
    let label = studyMode
    label = courseHelper.getStudyModeLabel(studyMode)
    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the qualification label
  example: {{ 'pgce_with_qts' | getQualificationLabel }}
  outputs: "PGCE with QTS"
  ------------------------------------------------------------------ */
  filters.getQualificationLabel = (qualification) => {
    let label = qualification
    label = courseHelper.getQualificationLabel(qualification)
    return label
  }

  // TODO: qualification description

  /* ------------------------------------------------------------------
  utility function to get the location label
  example: {{ '92a06b2e-638e-4dc8-b43f-bbbbf046eca2' | getLocationLabel }}
  outputs: "Main site"
  ------------------------------------------------------------------ */
  filters.getLocationLabel = (location) => {
    let label = location
    label = locationHelper.getLocationLabel(location)
    return label
  }

  // TODO: location description

  /* ------------------------------------------------------------------
  utility function to get the cycle label
  example: {{ '2022' | getCycleLabel }}
  outputs: "2021 to 2022 - current"
  ------------------------------------------------------------------ */
  filters.getCycleLabel = (cycle) => {
    let label = cycle
    label = cycleHelper.getCycleLabel(cycle)
    return label
  }

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
