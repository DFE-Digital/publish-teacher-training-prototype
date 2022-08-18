const { DateTime } = require('luxon')
const faker = require('faker')
faker.locale = 'en_GB'

const subjectHelper = require('./subjects')
const utilHelper = require('./utils')

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
}, {
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

  items.sort((a, b) => {
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
  } else if (code === '3_to_11') {
    label = '3 to 11'
  } else if (code === 'other') {
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

  studyModes.forEach((studyMode, i) => {
    const item = {}

    item.text = studyMode.name
    item.value = studyMode.code
    item.id = studyMode.id
    item.checked = (selectedItem && selectedItem.includes(studyMode.code)) ? 'checked' : ''

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

exports.getCourseStartSelectOptions = (selectedItem) => {
  const items = []

  const startDate = DateTime.now().toJSDate()
  const endDate = DateTime.now().plus({ months: 18 }).toJSDate()

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
    item.selected = (selectedItem && selectedItem === code) ? 'selected' : ''

    items.push(item)
  }

  const firstItem = {}
  firstItem.text = ''
  firstItem.value = ''
  firstItem.id = 'blank'
  firstItem.selected = (selectedItem && selectedItem === '') ? 'selected' : ''

  items.unshift(firstItem)

  return items
}

exports.getCourseStartRadioOptions = (selectedItem) => {
  const items = []

  const startDate = DateTime.now().toJSDate()
  const endDate = DateTime.now().plus({ months: 12 }).toJSDate()

  const checkedItem = DateTime.fromISO(selectedItem).toFormat('yyyy-LL')

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
    item.checked = (checkedItem && checkedItem === code) ? 'checked' : ''

    items.push(item)
  }

  return items
}

exports.getCourseStartLabel = (code) => {

}

exports.getApprenticeshipOptions = (selectedItem) => {
  const items = []

  // from funding-types.json
  const options = [{
    id: '7c66b08b-d3ab-4678-861c-21ae6e1c08e7',
    code: 'apprenticeship',
    name: 'Yes'
  }, {
    id: 'e9d75c90-eec3-446e-8b2e-1afa096b422b',
    code: 'fee',
    name: 'No'
  }]

  options.forEach((options, i) => {
    const item = {}

    item.text = options.name
    item.value = options.code
    item.id = options.id
    item.checked = (selectedItem && selectedItem.includes(options.code)) ? 'checked' : ''

    items.push(item)
  })

  return items
}

exports.getApprenticeshipLabel = (code) => {
  // from funding-types.json
  const options = [{
    id: '7c66b08b-d3ab-4678-861c-21ae6e1c08e7',
    code: 'apprenticeship',
    name: 'Yes'
  }, {
    id: 'e9d75c90-eec3-446e-8b2e-1afa096b422b',
    code: 'fee',
    name: 'No'
  }]

  const answer = options.find(option => option.code === code)

  let label = code

  if (answer) {
    label = answer.name
  }

  return label
}

exports.getCourseLengthOptions = (selectedItem) => {
  const items = []
  const courseLengths = require('../data/course-lengths')

  courseLengths.forEach((courseLength, i) => {
    const item = {}

    item.text = courseLength.name
    item.value = courseLength.code
    item.id = courseLength.id
    item.checked = (selectedItem && selectedItem.includes(courseLength.code)) ? 'checked' : ''

    items.push(item)
  })

  // items.sort((a,b) => {
  //   return a.text.localeCompare(b.text)
  // })

  const divider = { divider: 'or' }
  items.push(divider)

  const other = {}
  other.text = 'Another course length'
  other.value = 'other'
  other.id = 'course-length-other'
  other.checked = (selectedItem && selectedItem.includes('other')) ? 'checked' : ''
  other.conditional = true
  items.push(other)

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

exports.getCourseStatusLabel = (code, openDate = null) => {
  const courseStatuses = require('../data/course-statuses')
  const courseStatus = courseStatuses.find(courseStatus => courseStatus.code === code.toString())

  const dateOpen = DateTime.fromISO(openDate)

  const dateDiff = dateOpen.diffNow('seconds').toObject().seconds

  let label = code

  // if the course is open/closed, and applications open is in the future
  if ([1,4].includes(parseInt(courseStatus.code)) && dateDiff > 0) {
    label = 'scheduled'
  } else {
    if (courseStatus) {
      label = courseStatus.name
    }
  }

  return label
}

exports.getCourseStatusClasses = (code, openDate = null) => {
  const courseStatuses = require('../data/course-statuses')
  const courseStatus = courseStatuses.find(courseStatus => courseStatus.code === code.toString())

  const dateOpen = DateTime.fromISO(openDate)

  const dateDiff = dateOpen.diffNow('seconds').toObject().seconds

  let classes

  // if the course is open/closed, and applications open is in the future
  if ([1,4].includes(parseInt(courseStatus.code)) && dateDiff > 0) {
    classes = 'govuk-tag--blue'
  } else {
    if (courseStatus) {
      classes = courseStatus.classes
    }
  }

  return classes
}

exports.createCourseName = (subjects) => {
  let courseName = ''
  if (subjects) {
    const names = []

    subjects.forEach((subject, i) => {
      if (subject !== 'ML') {
        names.push(
          subjectHelper.getSubjectLabel(subject)
        )
      }
    })

    if (subjects.includes('ML')) {
      courseName = 'Modern languages'
      courseName += ' ('
      courseName += utilHelper.arrayToList(
        array = names,
        join = ', ',
        final = ' and '
      )
      courseName += ')'
    } else {
      courseName = utilHelper.arrayToList(
        array = names,
        join = ' with ',
        final = ' and '
      )
    }
  }

  return courseName
}

// a course code must be 4 characters
// it must contain a combination of:
//  - numbers 2 - 9 (i.e. avoid 0 and 1)
//  - letters A - H, J - N, P - Z
//  - it must start with a letter
//  - not match any other course codes within the provider
//  - preferably be a completely UNIQUE course code

exports.createCourseCode = (organisationId) => {
  let courseCode = ''

  // get a list of current course codes

  // generate new code
  courseCode = faker.random.alphaNumeric(4).toUpperCase()

  // compare to current list
  // if not exists, return code, else generate new code and try again

  return courseCode
}

// a course has vacancies if one of its locations has F, P or B flags
// F - full time
// P - part time
// B - full time and part time
// empty string - no vacancies

exports.hasVacancies = (locations) => {
  let hasVacancies = false

  locations.forEach((location, i) => {
    if (['F','P','B'].includes(location.vacancies)) {
      hasVacancies = true
    }
  })

  return hasVacancies
}
