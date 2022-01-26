// const DEGREE_GRADES = {
//   0: "2:1 or above, or equivalent",
//   1: "2:2 or above, or equivalent",
//   2: "Third or above, or equivalent",
//   9: "Not required"
// }

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
  let label = code
  const ageRanges = require('../data/age-ranges')

  label = ageRanges.find(ageRange => ageRange.code === code).name

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
    item.checked = (selectedItem && selectedItem.includes(qualification.code)) ? 'checked' : ''

    item.hint = {}
    item.hint.text = qualification.description

    items.push(item)
  })

  return items
}

exports.getQualificationLabel = (code) => {
  let label = code
  const qualifications = require('../data/qualifications')

  label = qualifications.find(qualification => qualification.code === code).name

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
  let label = code
  const fundingTypes = require('../data/funding-types')

  label = fundingTypes.find(fundingType => fundingType.code === code).name

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
  let label = code
  const studyModes = require('../data/study-modes')

  label = studyModes.find(studyMode => studyMode.code === code).name

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
