const path = require('path')
const fs = require('fs')

const courseModel = require('./courses')

const directoryPath = path.join(__dirname, '../data/courses')

exports.updateOne = (params) => {
  let course

  if (params.organisationId && params.courseId) {
    course = courseModel.findOne({ organisationId: params.organisationId, courseId: params.courseId })

    if (params.locations) {
      const locations = []

      course.locations.forEach((location, i) => {

        if (params.locations.vacancies?.includes(location.id)) {
          location.vacancies = course.studyMode
        } else {
          location.vacancies = ''
        }

        locations.push(location)
      })

      course.locations = locations
      course.hasVacancies = 'yes'
    } else {
      course.hasVacancies = 'no'
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
