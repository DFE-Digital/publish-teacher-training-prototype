const path = require('path')
const fs = require('fs')

const courseModel = require('./courses')

const directoryPath = path.join(__dirname, '../data/dist/courses')

exports.updateOne = (params) => {
  let course

  if (params.organisationId && params.courseId) {
    course = courseModel.findOne({ organisationId: params.organisationId, courseId: params.courseId })

    course.acceptPendingGcse = params.course.acceptPendingGcse
    course.acceptGcseEquivalency = params.course.acceptGcseEquivalency

    if (params.course.acceptGcseEquivalency === 'yes') {
      delete course.acceptEnglishGcseEquivalency
      delete course.acceptMathsGcseEquivalency
      delete course.acceptScienceGcseEquivalency

      if (params.course.equivalentSubjects) {
        if (params.course.equivalentSubjects.includes('english')) {
          course.acceptEnglishGcseEquivalency = 'yes'
        }

        if (params.course.equivalentSubjects.includes('maths')) {
          course.acceptMathsGcseEquivalency = 'yes'
        }

        if (params.course.equivalentSubjects.includes('science')) {
          course.acceptScienceGcseEquivalency = 'yes'
        }
      }

      if (params.course.additionalGcseEquivalencies) {
        course.additionalGcseEquivalencies = params.course.additionalGcseEquivalencies
      } else {
        delete course.additionalGcseEquivalencies
      }
    } else {
      delete course.acceptEnglishGcseEquivalency
      delete course.acceptMathsGcseEquivalency
      delete course.acceptScienceGcseEquivalency
      delete course.additionalGcseEquivalencies
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
