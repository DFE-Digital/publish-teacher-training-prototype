const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

exports.find = (params = {}) => {
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

exports.findOne = (params = {}) => {
  let course = {}

  if (params.organisationId && params.courseId) {
    const directoryPath = path.join(__dirname, '../data/courses/' + params.organisationId)

    const filePath = directoryPath + '/' + params.courseId + '.json'

    let raw = fs.readFileSync(filePath)
    course = JSON.parse(raw)
  }

  return course
}

exports.insertOne = (params = {}) => {

}

// exports.insertMany = (params = {}) => {
//
// }

exports.updateOne = (params = {}) => {
  if (params.organisationId && params.courseId) {

    let course = this.findOne({ organisationId: params.organisationId, courseId: params.courseId })



  }
}

// exports.updateMany = (params) => {
//
// }

exports.deleteOne = (params = {}) => {
  if (params.organisationId && params.courseId) {
    const directoryPath = path.join(__dirname, '../data/courses/' + params.organisationId)

    const filePath = directoryPath + '/' + params.courseId + '.json'
    fs.unlinkSync(filePath)
  }
}

// exports.deleteMany = (params) => {
//
// }
