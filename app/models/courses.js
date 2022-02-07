const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

const organisationModel = require('./organisations')
const subjectModel = require('./subjects')

exports.find = (params) => {
  let courses = []

  if (params.organisationId) {
    const directoryPath = path.join(__dirname, '../data/courses/' + params.organisationId)

    // to prevent errors when an organisation doesn't have any courses
    // create an empty course directory for the organisation
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath)
    }

    let documents = fs.readdirSync(directoryPath,'utf8')

    // Only get JSON documents
    documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

    documents.forEach((filename) => {
      let raw = fs.readFileSync(directoryPath + '/' + filename)
      let data = JSON.parse(raw)
      courses.push(data)
    })
  }

  return courses
}

exports.findOne = (params) => {
  let course = {}

  if (params.organisationId && params.courseId) {
    const directoryPath = path.join(__dirname, '../data/courses/' + params.organisationId)

    const filePath = directoryPath + '/' + params.courseId + '.json'

    let raw = fs.readFileSync(filePath)
    course = JSON.parse(raw)
  }

  return course
}

exports.insertOne = (params) => {
  if (params) {

    let course = {}



    course.createdAt = new Date()

    const directoryPath = path.join(__dirname, '../data/courses/' + params.organisationId)

    const filePath = directoryPath + '/' + params.courseId + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(course)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }
}

// exports.insertMany = (params) => {
//
// }

exports.updateOne = (params) => {
  if (params.organisationId && params.courseId) {

    let course = this.findOne({ organisationId: params.organisationId, courseId: params.courseId })

    if (params.course.name) {
      course.name = params.course.name
    }

    if (params.course.code) {
      course.code = params.course.code
    }

    if (params.course.subjectLevel) {
      course.subjectLevel = params.course.subjectLevel
    }

    if (params.course.isSend) {
      course.isSend = params.course.isSend
    }

    if (params.course.subjects) {
      const subjects = []

      params.course.subjects.forEach((courseSubject, i) => {
        const subject = {}

        const s = subjectModel.findOne({ subjectId: courseSubject })

        subject.id = s.id
        subject.code = s.code
        subject.name = s.name

        subjects.push(subject)
      })

      course.subjects = subjects
    }

    if (params.course.locations) {

    }

    if (params.course.ageRange) {
      course.ageRange = params.course.ageRange

      // handle 'other' age ranges
      if (params.course.ageRange === 'other') {
        course.ageRangeOther = {}
        course.ageRangeOther.from = params.course.ageRangeOther.from
        course.ageRangeOther.to = params.course.ageRangeOther.to
      } else {
        delete course.ageRangeOther
      }
    }

    if (params.course.fundingType) {
      course.fundingType = params.course.fundingType

      // update programType based on organisation type and funding type
      const tp = organisationModel.findOne({ organisationId: params.organisationId })

      if (tp.type === 'lead_school') {
        if (params.course.fundingType === 'fee') {
          course.programType = 'SD'
        }

        if (params.course.fundingType === 'salary') {
          course.programType = 'SS'
        }

        if (params.course.fundingType === 'apprenticeship') {
          course.programType = 'TA'
        }
      }

      if (tp.type === 'scitt') {
        course.programType = 'SC'
      }

      if (tp.type === 'hei') {
        course.programType = 'HE'
      }

    }

    if (params.course.studyMode) {
      course.studyMode = params.course.studyMode
    }

    if (params.course.qualification) {
      course.qualification = params.course.qualification
    }

    if (params.course.accreditedBody) {
      const ab = organisationModel.findOne({ organisationId: params.course.accreditedBody })

      course.accreditedBody = {}
      course.accreditedBody.id = ab.id
      course.accreditedBody.code = ab.code
      course.accreditedBody.name = ab.name
    }

    if (params.course.startDate) {
      course.startDate = params.course.startDate
    }

    if (params.course.applicationsOpenDate) {
      course.applicationsOpenDate = params.course.applicationsOpenDate

      // handle 'other' applications open dates
      if (params.course.applicationsOpenDate === 'other') {
        course.applicationsOpenDateOther = params.course.applicationsOpenDateOther
      } else {
        delete course.applicationsOpenDateOther
      }
    }

    course.updatedAt = new Date()

    const directoryPath = path.join(__dirname, '../data/courses/' + params.organisationId)

    const filePath = directoryPath + '/' + params.courseId + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(course)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }
}

// exports.updateMany = (params) => {
//
// }

exports.deleteOne = (params) => {
  if (params.organisationId && params.courseId) {
    const directoryPath = path.join(__dirname, '../data/courses/' + params.organisationId)

    const filePath = directoryPath + '/' + params.courseId + '.json'
    fs.unlinkSync(filePath)
  }
}

// exports.deleteMany = (params) => {
//
// }
