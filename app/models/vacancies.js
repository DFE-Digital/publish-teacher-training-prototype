const path = require('path')
const fs = require('fs')

const courseModel = require('./courses')

const directoryPath = path.join(__dirname, '../data/dist/courses')

exports.updateOne = (params) => {
  let course

  if (params.organisationId && params.courseId) {
    course = courseModel.findOne({ organisationId: params.organisationId, courseId: params.courseId })

    if (params.locations) {
      const locations = []
      let hasVacancies = false

      course.locations.forEach((location, i) => {

        if (params.locations.vacancies?.includes(location.id)) {
          location.vacancies = course.studyMode
          hasVacancies = true
        } else {
          location.vacancies = ''
        }

        locations.push(location)
      })

      course.locations = locations

      if (hasVacancies) {
        course.hasVacancies = 'yes'
        course.status = 1
      } else {
        course.hasVacancies = 'no'
        course.status = 4
      }
    } else {
      course.hasVacancies = 'no'
      course.status = 4
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
