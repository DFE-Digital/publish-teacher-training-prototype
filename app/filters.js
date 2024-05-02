const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const { DateTime } = require('luxon')
const marked = require('marked')
const { gfmHeadingId } = require('marked-gfm-heading-id')
const numeral = require('numeral')

const courseHelper = require('./helpers/courses')
const cycleHelper = require('./helpers/cycles')
const degreeHelper = require('./helpers/degrees')
const financialIncentivesHelper = require('./helpers/financial-incentives')
const locationHelper = require('./helpers/locations')
const notificationHelper = require('./helpers/notifications')
const organisationHelper = require('./helpers/organisations')
const permissionHelper = require('./helpers/permissions')
const subjectHelper = require('./helpers/subjects')
const visaSponsorshipHelper = require('./helpers/visa-sponsorship')

const individualFiltersFolder = path.join(__dirname, './filters')

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
    const fileData = require(path.join(individualFiltersFolder, file))
    // Loop through each exported function in file (likely just one)
    Object.keys(fileData).forEach((filterGroup) => {
      // Get each method from the file
      Object.keys(fileData[filterGroup]).forEach(filterName => {
        filters[filterName] = fileData[filterGroup][filterName]
      })
    })
  })
}

filters.includes = (route, string) => {
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
  if (_.isString(input)) {
    const truthyValues = ['yes', 'true']
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
utility function to get the apprenticeship label (based on funding type)
example: {{ 'fee' | getApprenticeshipLabel }}
outputs: "No"
------------------------------------------------------------------ */
filters.getApprenticeshipLabel = (fundingType) => {
  let label = fundingType

  if (fundingType) {
    label = courseHelper.getApprenticeshipLabel(fundingType)
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
example: {{ '92a06b2e-638e-4dc8-b43f-bbbbf046eca2'
            | getLocationLabel(d8370001-6f2b-4624-b30c-27ddc5beebfc) }}
outputs: "Main site"
------------------------------------------------------------------ */
filters.getLocationLabel = (location, organisation) => {
  let label = location

  if (location && organisation) {
    label = locationHelper.getLocationLabel(location, organisation)
  }

  return label
}

/* ------------------------------------------------------------------
utility function to get the study site label
example: {{ '92a06b2e-638e-4dc8-b43f-bbbbf046eca2'
            | getStudySiteLabel(d8370001-6f2b-4624-b30c-27ddc5beebfc) }}
outputs: "My favourite study site"
------------------------------------------------------------------ */
filters.getStudySiteLabel = (studySite, organisation) => {
  let label = studySite

  if (studySite && organisation) {
    label = locationHelper.getStudySiteLabel(studySite, organisation)
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
filters.getCourseStatusLabel = (status, openDate = null) => {
  let label = status

  if (status !== undefined) {
    label = courseHelper.getCourseStatusLabel(status.toString(), openDate)
  }

  return label
}

/* ------------------------------------------------------------------
utility function to get the course status colour
example: {{ "1" | getCourseStatusColour }}
outputs: "govuk-tag--green"
------------------------------------------------------------------ */
filters.getCourseStatusClasses = (status, openDate = null) => {
  let label

  if (status !== undefined) {
    label = courseHelper.getCourseStatusClasses(status.toString(), openDate)
  }

  return label
}

/* ------------------------------------------------------------------
utility function to get the student visa label
example: {{ "yes" | getStudentVisaLabel }}
outputs: "Yes"
------------------------------------------------------------------ */
filters.getStudentVisaLabel = (code) => {
  let label

  if (code) {
    label = visaSponsorshipHelper.getStudentVisaLabel(code)
  }

  return label
}

/* ------------------------------------------------------------------
utility function to get the skilled worker visa label
example: {{ "no" | getStudentVisaLabel }}
outputs: "No, or not applicable"
------------------------------------------------------------------ */
filters.getSkilledWorkerVisaLabel = (code) => {
  let label

  if (code) {
    label = visaSponsorshipHelper.getSkilledWorkerVisaLabel(code)
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

  const text = markdown.replace(/\\r/g, '\n').replace(/\\t/g, ' ')
  const html = marked.parse(text)

  // Add govuk-* classes
  let govukHtml = html.replace(/<p>/g, '<p class="govuk-body">')
  govukHtml = govukHtml.replace(/<ol>/g, '<ol class="govuk-list govuk-list--number">')
  govukHtml = govukHtml.replace(/<ul>/g, '<ul class="govuk-list govuk-list--bullet">')
  govukHtml = govukHtml.replace(/<h2/g, '<h2 class="govuk-heading-l"')
  govukHtml = govukHtml.replace(/<h3/g, '<h3 class="govuk-heading-m"')
  govukHtml = govukHtml.replace(/<h4/g, '<h4 class="govuk-heading-s"')

  return govukHtml
}

/* ------------------------------------------------------------------
utility function to get the notification label
example: {{ "course_changed" | getNotificationLabel }}
outputs: "Course is changed"
------------------------------------------------------------------ */
filters.getNotificationLabel = (code) => {
  let label

  if (code) {
    label = notificationHelper.getNotificationLabel(code)
  }

  return label
}

/* ------------------------------------------------------------------
utility function to get the permission label
example: {{ "change_courses" | getPermissionLabel }}
outputs: "Change courses"
------------------------------------------------------------------ */
filters.getPermissionLabel = (code) => {
  let label

  if (code) {
    label = permissionHelper.getPermissionLabel(code)
  }

  return label
}

/* ------------------------------------------------------------------
utility function to get the degree label
example: {{ "1" | getDegreeGradeLabel }}
outputs: "2:1 or above (or equivalent)"
------------------------------------------------------------------ */
filters.getDegreeGradeLabel = (code) => {
  let label

  if (code) {
    label = degreeHelper.getDegreeGradeLabel(code)
  }

  return label
}

/* ------------------------------------------------------------------
utility function to get the remainder when one operand is divided by
a second operand
example: {{ 4 | remainder(2) }}
outputs: 0
------------------------------------------------------------------ */
filters.remainder = (dividend, divisor) => {
  return dividend % divisor
}

/* ------------------------------------------------------------------
utility function to get the academic year label
example: {{ "2022-09" | getAcademicYearLabel }}
outputs: "Academic year 2022 to 2023"
------------------------------------------------------------------ */
filters.getAcademicYearLabel = (courseStartDate) => {
  let label = ''

  if (courseStartDate) {
    const checkDate = DateTime.fromISO(courseStartDate)

    const startDate = DateTime.fromISO(checkDate.year + '-08-01T00:00:00')
    const endDate = DateTime.fromISO((checkDate.year + 1) + '-07-31T23:59:59')

    if (checkDate >= startDate && checkDate <= endDate) {
      label = 'Academic year ' + checkDate.year + ' to ' + (checkDate.year + 1)
    } else {
      label = 'Academic year ' + (checkDate.year - 1) + ' to ' + checkDate.year
    }
  }

  return label
}

/* ------------------------------------------------------------------
utility function to get the financial incentive label
example: {{ "F1" | getFinancialIncentiveLabel("2022-09") }}
outputs: "Bursaries of £24,000 available"
------------------------------------------------------------------ */
filters.getFinancialIncentiveLabel = (subjectCode, courseStartDate) => {
  let label = ''

  if (subjectCode && courseStartDate) {
    const checkDate = DateTime.fromISO(courseStartDate)

    const startDate = DateTime.fromISO(checkDate.year + '-08-01T00:00:00')
    const endDate = DateTime.fromISO((checkDate.year + 1) + '-07-31T23:59:59')

    let academicYear

    if (checkDate >= startDate && checkDate <= endDate) {
      academicYear = (checkDate.year + 1)
    } else {
      academicYear = checkDate.year
    }

    label = financialIncentivesHelper.getFinancialIncentiveLabel(subjectCode, academicYear)
  }

  return label
}

/* ------------------------------------------------------------------
GOV.UK style dates
@type {Date} date
------------------------------------------------------------------ */
filters.govukDateAtTime = (date) => {
  const govukDate = filters.govukDate(date)
  const time = filters.time(date)
  return govukDate + ' at ' + time
}

filters.govukShortDateAtTime = (date) => {
  const govukDate = filters.dateToGovukDate(date)
  const time = filters.time(date)
  return govukDate + ' at ' + time
}

/* ------------------------------------------------------------------
GOV.UK style times
@type {Date} date
------------------------------------------------------------------ */
filters.time = (date) => {
  let dt = DateTime.fromISO(date)
  if (dt.minute > 0) {
    dt = dt.toFormat('h:mma')
  } else {
    dt = dt.toFormat('ha')
  }
  return dt.toLowerCase()
}

/*  ------------------------------------------------------------------
Convert array to readable list format using 'and'
@param {Array} array Array to convert
@example [A, B, C] => A, B and C
------------------------------------------------------------------  */
filters.formatList = (array = []) => {
  const lf = new Intl.ListFormat('en')
  return lf.format(array)
}

/*  ------------------------------------------------------------------
Convert subject list to course name
@param {Array} array Array to convert
@example [A, B, C] => A, B and C
------------------------------------------------------------------  */
filters.getCourseName = (subjects, campaign = null) => {
  return courseHelper.getCourseName(subjects, campaign)
}

/* ------------------------------------------------------------------
utility function to get the guidance section label
example: {{ "account" | getGuidanceSectionLabel }}
outputs: "Your account"
------------------------------------------------------------------ */
filters.getGuidanceSectionLabel = (section) => {
  let label = ''

  if (section === 'account') {
    label = 'Your account'
  } else if (section === 'courses') {
    label = 'Managing courses'
  }

  return label
}


for (let filterName of filters){
  addFilter(filterName, filters[filterName])
}
