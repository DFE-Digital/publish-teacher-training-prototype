const { DateTime } = require('luxon')

const cycleHelper = require('./cycles')

// const DEGREE_GRADES = {
//   0: "2:1 or above, or equivalent",
//   1: "2:2 or above, or equivalent",
//   2: "Third or above, or equivalent",
//   9: "Not required"
// }

const sendOptions = [{
  id: '5289e0bd-830b-46f6-948e-685214651beb',
  name: 'Yes',
  code: 'yes'
},{
  id: '0c4ababf-9acb-4105-973d-ce931cf89a94',
  name: 'No',
  code: 'no'
}]

exports.getSendOptions = (selectedItem) => {
  const items = []

  sendOptions.forEach((send, i) => {
    const item = {}

    item.text = send.name
    item.value = send.code
    item.id = send.id
    item.checked = (selectedItem && selectedItem.includes(send.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

exports.getSendLabel = (code) => {
  const option = sendOptions.find(send => send.code === code)
  let label = code

  if (option) {
    label = option.name
  }

  return label
}

exports.getAgeRangeOptions = (subjectLevel = 'secondary', selectedItem) => {
  const items = []

  let ageRanges = require('../data/age-ranges')
  if (subjectLevel) {
    ageRanges = ageRanges.filter(range => range.level === subjectLevel)
  }

  ageRanges.forEach((ageRange, i) => {
    const item = {}

    item.text = ageRange.name
    item.value = ageRange.code
    item.id = ageRange.id
    item.checked = (selectedItem && selectedItem.includes(ageRange.code)) ? 'checked' : ''

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  const divider = { divider: 'or' }
  items.push(divider)

  const other = {}
  other.text = 'Another age range'
  other.value = 'other'
  other.id = 'age-range-other'
  other.checked = (selectedItem && selectedItem.includes('other')) ? 'checked' : ''
  other.conditional = true
  items.push(other)

  return items
}

exports.getAgeRangeLabel = (code) => {
  const ageRanges = require('../data/age-ranges')
  const ageRange = ageRanges.find(ageRange => ageRange.code === code)

  let label = code

  if (ageRange) {
    label = ageRange.name
  }

  if (code === 'other') {
    label = 'Another age range'
  }

  return label
}

exports.getQualificationOptions = (subjectLevel, selectedItem) => {
  const items = []

  let qualifications = require('../data/qualifications')
  qualifications = qualifications.filter(qualification => qualification.levels.includes(subjectLevel))

  qualifications.forEach((qualification, i) => {
    const item = {}

    item.text = qualification.name
    item.value = qualification.code
    item.id = qualification.id
    item.checked = (selectedItem && selectedItem === qualification.code) ? 'checked' : ''

    item.hint = {}
    item.hint.text = qualification.description

    items.push(item)
  })

  return items
}

exports.getQualificationLabel = (code) => {
  const qualifications = require('../data/qualifications')
  const qualification = qualifications.find(qualification => qualification.code === code)

  let label = code

  if (qualification) {
    label = qualification.name
  }

  return label
}

// TODO: funding type is dependent on provider type -> programType
// higher_education_programme: "HE",
// school_direct_training_programme: "SD",
// school_direct_salaried_training_programme: "SS",
// scitt_programme: "SC",
// pg_teaching_apprenticeship: "TA"
exports.getFundingTypeOptions = (selectedItem) => {
  const items = []
  const fundingTypes = require('../data/funding-types')

  fundingTypes.forEach((fundingType, i) => {
    const item = {}

    item.text = fundingType.name
    item.value = fundingType.code
    item.id = fundingType.id
    item.checked = (selectedItem && selectedItem.includes(fundingType.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

exports.getFundingTypeLabel = (code) => {
  const fundingTypes = require('../data/funding-types')
  const fundingType = fundingTypes.find(fundingType => fundingType.code === code)

  let label = code

  if (fundingType) {
    label = fundingType.name
  }

  return label
}

exports.getStudyModeOptions = (selectedItem) => {
  const items = []
  const studyModes = require('../data/study-modes')

  studyModes.forEach((studyModes, i) => {
    const item = {}

    item.text = studyModes.name
    item.value = studyModes.code
    item.id = studyModes.id
    item.checked = (selectedItem && selectedItem.includes(studyModes.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

exports.getStudyModeLabel = (code) => {
  const studyModes = require('../data/study-modes')
  const studyMode = studyModes.find(studyMode => studyMode.code === code)

  let label = code

  if (studyMode) {
    label = studyMode.name
  }

  return label
}

exports.getAccreditedBodyOptions = (organisationId, selectedItem) => {
  const items = []

  let relationships = require('../data/organisation-relationships')
  if (organisationId) {
    relationships = relationships.find(relationship => relationship.code === organisationId)
  }

  relationships.accreditedBodies.forEach((accreditedBody, i) => {
    const item = {}

    item.text = accreditedBody.name
    item.value = accreditedBody.code
    item.id = accreditedBody.code
    item.checked = (selectedItem && selectedItem.includes(accreditedBody.code)) ? 'checked' : ''

    items.push(item)
  })

  items.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  const divider = { divider: 'or' }
  items.push(divider)

  const other = {}
  other.text = 'Another accredited body'
  other.value = 'other'
  other.id = 'accredited-body-other'
  other.checked = (selectedItem && selectedItem.includes('other')) ? 'checked' : ''
  other.conditional = true
  items.push(other)

  return items
}

exports.getCourseStartSelectOptions = (selectedItem) => {
  const items = []

  const startDate = DateTime.now().toJSDate()
  const endDate = DateTime.now().plus({months:18}).toJSDate()

  for (let d = startDate; d <= endDate; d.setMonth(d.getMonth() + 1)) {
    const item = {}

    const code = DateTime.fromJSDate(d, {
      locale: 'en-GB'
    }).toFormat('yyyy-LL')

    item.text = DateTime.fromJSDate(d, {
      locale: 'en-GB'
    }).toFormat('MMMM yyyy')

    item.value = code
    item.id = code
    item.selected = (selectedItem && selectedItem.includes(code)) ? 'selected' : ''

    items.push(item)
  }

  return items
}

exports.getCourseStartLabel = (code) => {

}

exports.getApprenticeshipOptions = (selectedItem) => {
  const items = []
  const options = [{
    code: 'yes',
    name: 'Yes'
  }, {
    code: 'no',
    name: 'No'
  }]

  options.forEach((options, i) => {
    const item = {}

    item.text = options.name
    item.value = options.code
    item.id = options.code
    item.checked = (selectedItem && selectedItem.includes(options.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

exports.getCourseLengthLabel = (code) => {
  const courseLengths = require('../data/course-lengths')
  const courseLength = courseLengths.find(courseLength => courseLength.code === code)

  let label = code

  if (courseLength) {
    label = courseLength.name
  }

  return label
}

exports.getCourseStatusLabel = (code) => {
  const courseStatuses = require('../data/course-statuses')
  const courseStatus = courseStatuses.find(courseStatus => courseStatus.code === code.toString())
console.log(code);
console.log(courseStatuses);
console.log(courseStatus);

  let label = code

  if (courseStatus) {
    label = courseStatus.name
  }

  return label
}
