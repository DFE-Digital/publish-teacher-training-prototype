const path = require('path')
const fs = require('fs')

const courseModel = require('./courses')

const directoryPath = path.join(__dirname, '../data/courses')

exports.updateOne = (params) => {
  let course

  if (params.organisationId && params.courseId) {
    course = courseModel.findOne({ organisationId: params.organisationId, courseId: params.courseId })

    course.degreeGrade = params.degree.grade

    if (params.degree.requirements) {
      course.additionalDegreeSubjectRequirements = params.degree.requirements
    } else {
      delete course.additionalDegreeSubjectRequirements
    }

    course.updatedAt = new Date()

    const filePath = directoryPath + '/' + params.organisationId + '/' + params.courseId + '.json'

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(course)

    // write the JSON data
    fs.writeFileSync(filePath, fileData)
  }

  return course
}
