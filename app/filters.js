const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const marked = require('marked')
const numeral = require('numeral')

const courseHelper = require('./helpers/courses')
const cycleHelper = require('./helpers/cycles')
const locationHelper = require('./helpers/locations')
const organisationHelper = require('./helpers/organisations')
const subjectHelper = require('./helpers/subjects')

const individualFiltersFolder = path.join(__dirname, './filters')

module.exports = (env) => {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {}

  // Import filters from filters folder
  if (fs.existsSync(individualFiltersFolder)) {
    const files = fs.readdirSync(individualFiltersFolder)
    files.forEach(file => {
      let fileData = require(path.join(individualFiltersFolder, file))
      // Loop through each exported function in file (likely just one)
      Object.keys(fileData).forEach((filterGroup) => {
        // Get each method from the file
        Object.keys(fileData[filterGroup]).forEach(filterName => {
          filters[filterName] = fileData[filterGroup][filterName]
        })
      })
    })
  }

  filters.includes = (route, string) =>{
    if (route && route.includes(string)) {
      return true
    } else {
      return false
    }
  }

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
   numeral filter for use in Nunjucks
   example: {{ params.number | numeral("0,00.0") }}
   outputs: 1,000.00
  ------------------------------------------------------------------ */
  filters.numeral = (number, format) => {
   return numeral(number).format(format)
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
  utility function to get the subject level label
  example: {{ 'further_education' | getSubjectLevelLabel }}
  outputs: "Further education"
  ------------------------------------------------------------------ */
  filters.getSubjectLevelLabel = (subjectLevel) => {
    let label = subjectLevel

    if (subjectLevel) {
      label = subjectHelper.getSubjectLevelLabel(subjectLevel)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the subject label
  example: {{ 'W1' | getSubjectLabel }}
  outputs: "Art and design"
  ------------------------------------------------------------------ */
  filters.getSubjectLabel = (subject) => {
    let label = subject

    if (subject) {
      label = subjectHelper.getSubjectLabel(subject)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the SEND label
  example: {{ 'yes' | getSendLabel }}
  outputs: "Yes"
  ------------------------------------------------------------------ */
  filters.getSendLabel = (send) => {
    let label
    if (send) {
      label = courseHelper.getSendLabel(send)
    }
    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the age range label
  example: {{ '5_to_11' | getAgeRangeLabel }}
  outputs: "5 to 11"
  ------------------------------------------------------------------ */
  filters.getAgeRangeLabel = (ageRange) => {
    let label = ageRange

    if (ageRange) {
      label = courseHelper.getAgeRangeLabel(ageRange)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the funding type label
  example: {{ 'fee' | getFundingTypeLabel }}
  outputs: "Fee paying (no salary)"
  ------------------------------------------------------------------ */
  filters.getFundingTypeLabel = (fundingType) => {
    let label = fundingType

    if (fundingType) {
      label = courseHelper.getFundingTypeLabel(fundingType)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the study mode label
  example: {{ 'both' | getStudyModeLabel }}
  outputs: "Full time or part time"
  ------------------------------------------------------------------ */
  filters.getStudyModeLabel = (studyMode) => {
    let label = studyMode

    if (studyMode) {
      label = courseHelper.getStudyModeLabel(studyMode)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the qualification label
  example: {{ 'pgce_with_qts' | getQualificationLabel }}
  outputs: "PGCE with QTS"
  ------------------------------------------------------------------ */
  filters.getQualificationLabel = (qualification) => {
    let label = qualification

    if (qualification) {
      label = courseHelper.getQualificationLabel(qualification)
    }

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

    if (location) {
      label = locationHelper.getLocationLabel(location)
    }

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

    if (cycle) {
      label = cycleHelper.getCycleLabel(cycle)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the organisation label
  example: {{ '2022' | getOrganisationLabel }}
  outputs: "2021 to 2022 - current"
  ------------------------------------------------------------------ */
  filters.getOrganisationLabel = (organisation) => {
    let label = organisation

    if (organisation) {
      label = organisationHelper.getOrganisationLabel(organisation)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the course length label
  example: {{ 'OneYear' | getCourseLengthLabel }}
  outputs: "One year"
  ------------------------------------------------------------------ */
  filters.getCourseLengthLabel = (length) => {
    let label = length

    if (length) {
      label = courseHelper.getCourseLengthLabel(length)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the course status label
  example: {{ "1" | getCourseStatusLabel }}
  outputs: "Published"
  ------------------------------------------------------------------ */
  filters.getCourseStatusLabel = (status) => {
    let label = status

    if (status.toString()) {
      label = courseHelper.getCourseStatusLabel(status)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the course status colour
  example: {{ "1" | getCourseStatusColour }}
  outputs: "govuk-tag--green"
  ------------------------------------------------------------------ */
  filters.getCourseStatusClasses = (status) => {
    let label

    if (status.toString()) {
      label = courseHelper.getCourseStatusClasses(status)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to parse markdown as HTML
  example: {{ "## Title" | markdownToHtml }}
  outputs: "<h2>Title</h2>"
  ------------------------------------------------------------------ */

  filters.markdownToHtml = (markdown) => {
    if (!markdown) {
      return null
    }
    const html = marked.parse(markdown)
    return html
  }

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
