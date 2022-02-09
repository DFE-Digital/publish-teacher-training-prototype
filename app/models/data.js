const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

const subjects = require('../data/seed/subjects')

exports.seed = () => {
  // seedLocations()
  // seedOrganisations()
  // seedCourses()
  // seedRelationships()
}

const seedRelationships = () => {
  console.log('Seed organisations')

  const organisations = require('../data/seed/temp/organisations')
  const relationships = require('../data/seed/temp/organisation-relationships')

  const providers = []

  relationships.forEach((relationship, i) => {
    const tp = {}

    const tpo = organisations.find(o => o.code === relationship.code)

    tp.id = tpo.id
    tp.code = tpo.code
    tp.name = tpo.name

    tp.accreditedBodies = []

    relationship.accreditedBodies.forEach((accreditedBody, i) => {
      const ab = {}

      const abo = organisations.find(o => o.code === accreditedBody.code)

      ab.id = abo.id
      ab.code = abo.code
      ab.name = abo.name
      ab.description = accreditedBody.description

      tp.accreditedBodies.push(ab)
    })

    providers.push(tp)
  })

  // if (providers) {
  //   // write course data to file
  //   const directoryPath = path.join(__dirname, '../data/seed/temp/')
  //
  //   // check if document directory exists
  //   // if (!fs.existsSync(directoryPath)) {
  //   //   fs.mkdirSync(directoryPath)
  //   // }
  //
  //   const raw = JSON.stringify(providers)
  //
  //   const fileName = 'relationships.json'
  //   const filePath = directoryPath + '/' + fileName
  //
  //   // write the JSON data
  //   fs.writeFileSync(filePath, raw)
  // }

  console.log(providers)
}



const seedOrganisations = () => {
  console.log('Seed organisations')

  const organisations = require('../data/seed/temp/organisations')
}

// {
//   "id": "6e17935e-8481-4dff-8e35-e07c4e5231a2",
//   "name": "Peterbrough",
//   "code": "U",
//   "address": {
//     "postcode": "PE1 1EJ"
//   },
//   "organisation": {
//     "code": "2LC",
//     "name": "National Online Teacher Training"
//   }
// }

const seedLocations = () => {
  console.log('Seed locations')

  const organisations = require('../data/seed/temp/organisations')

  const locations = require('../data/seed/temp/locations')

  locations.forEach((location, i) => {
    const l = {}
    const o = organisations.find(organisation => organisation.code === location.organisation.code)

    l.id = location.id
    l.name = location.name
    l.code = location.code

    l.address = {}

    if (location.address) {
      if (location.address.addressLine1) {
        l.address.addressLine1 = location.address.addressLine1
      }

      if (location.address.addressLine2) {
        l.address.addressLine2 = location.address.addressLine2
      }

      if (location.address.town) {
        l.address.town = location.address.town
      }

      if (location.address.county) {
        l.address.county = location.address.county
      }

      if (location.address.postcode) {
        l.address.postcode = location.address.postcode
      }
    }

    l.organisation = {}

    l.organisation.id = o.id
    l.organisation.code = o.code
    l.organisation.name = o.name

    // if (l) {
    //   // write course data to file
    //   const directoryPath = path.join(__dirname, '../data/seed/locations/' + o.id)
    //
    //   // check if document directory exists
    //   if (!fs.existsSync(directoryPath)) {
    //     fs.mkdirSync(directoryPath)
    //   }
    //
    //   const raw = JSON.stringify(l)
    //
    //   const fileName = l.id + '.json'
    //   const filePath = directoryPath + '/' + fileName
    //
    //   // write the JSON data
    //   fs.writeFileSync(filePath, raw)
    // }

    // output location info
    console.log(i, l);
  })



}

const seedCourses = () => {
  console.log('Seed courses')

  const organisations = require('../data/seed/temp/organisations')

  const courses = require('../data/seed/temp/courses')
  const courseSubjects = require('../data/seed/temp/course-subjects')
  const courseLocations = require('../data/seed/temp/course-locations')

  const courseApplicationsOpenDates = require('../data/seed/temp/course-application-open-dates')

  const courseEnrichment1 = require('../data/seed/temp/course-enrichment-01')
  const courseEnrichment2 = require('../data/seed/temp/course-enrichment-02')
  const courseEnrichment3 = require('../data/seed/temp/course-enrichment-03')
  const courseEnrichment4 = require('../data/seed/temp/course-enrichment-04')

  const courseEnrichment = [...courseEnrichment1, ...courseEnrichment2, ...courseEnrichment3, ...courseEnrichment4]

  courseEnrichment.sort((a,b) => {
    return a.uuid.localeCompare(b.uuid) || new Date(a.created_at) - new Date(b.created_at)
  })

  courses.forEach((course, i) => {
    const c = {}

    c.id = course.id
    c.name = course.name
    c.code = course.code
    c.qualification = course.qualification
    c.startDate = course.startDate

    const ad = courseApplicationsOpenDates.find(openDate => openDate.id === course.id)

    if (ad) {
      c.applicationsOpenDate = ad.applicationsopendate
    } else {
      c.applicationsOpenDate = new Date(2021, 9, 12)
    }

    c.programType = course.programType

    if (['SD','SS','TA'].includes(course.programType)) {
      switch (course.programType) {
        case 'SD':
          c.fundingType = 'fee'
          break
        case 'SS':
          c.fundingType = 'salary'
          break
        case 'TA':
          c.fundingType = 'apprenticeship'
          break
      }
    }

    c.studyMode = course.studyMode
    c.ageRange = course.ageRange
    c.subjectLevel = course.level
    c.isSend = (course.isSend === 'true') ? 'yes' : 'no'

    // course subjects
    // TODO: use course.id
    const cs = courseSubjects.find(courseSubject => courseSubject.uuid === course.id)

    if (cs) {
      const subj = []

      if (cs.subjects) {
        cs.subjects.forEach((subject, i) => {
          const s = {}

          const sb = subjects.find(sub => sub.code === subject.code)

          if (sb) {
            s.id = sb.id
            s.code = sb.code
            s.name = sb.name

            subj.push(s)
          }
        })
      }

      c.subjects = subj
    }

    // course locations
    const cl = courseLocations.find(courseLocation => courseLocation.uuid === course.id)

    if (cl) {
      c.locations = cl.locations
    }

    // course training provider
    const tp = organisations.find(organisation => organisation.code === course.trainingProvider.code)

    if (tp) {
      c.trainingProvider = {}
      c.trainingProvider.id = tp.id
      c.trainingProvider.code = tp.code
      c.trainingProvider.name = tp.name
    }

    // course accredited body
    if (course.accreditedBody) {
      const ab = organisations.find(organisation => organisation.code === course.accreditedBody.code)

      if (ab) {

        // if there isn't a training provider, use the accredited body
        if (!c.trainingProvider) {
          c.trainingProvider = {}
          c.trainingProvider.id = ab.id
          c.trainingProvider.code = ab.code
          c.trainingProvider.name = ab.name
        } else {
          c.accreditedBody = {}
          c.accreditedBody.id = ab.id
          c.accreditedBody.code = ab.code
          c.accreditedBody.name = ab.name
        }

      }
    }

    // additional course stuff
    c.profPost = course.profPost

    c.degreeGrade = course.degreeGrade

    if (course.additionalDegreeSubjectRequirements) {
      c.additionalDegreeSubjectRequirements = course.additionalDegreeSubjectRequirements

      if (course.degreeSubjectRequirements) {
        c.degreeSubjectRequirements = course.degreeSubjectRequirements
      }
    }

    if (course.english) {
      c.english = course.english
    }

    if (course.maths) {
      c.maths = course.maths
    }

    if (course.science) {
      c.science = course.science
    }

    c.acceptPendingGcse = (course.acceptPendingGcse === 'true') ? 'yes' : 'no'
    c.acceptGcseEquivalency = (course.acceptGcseEquivalency === 'true') ? 'yes' : 'no'
    c.acceptEnglishGcseEquivalency = (course.acceptEnglishGcseEquivalency === 'true') ? 'yes' : 'no'
    c.acceptMathsGcseEquivalency = (course.acceptMathsGcseEquivalency === 'true') ? 'yes' : 'no'

    if (course.science && course.acceptScienceGcseEquivalency) {
      c.acceptScienceGcseEquivalency = (course.acceptScienceGcseEquivalency === 'true') ? 'yes' : 'no'
    }

    if (course.additionalGcseEquivalencies) {
      c.additionalGcseEquivalencies = course.additionalGcseEquivalencies
    }

    // course enrichment
    const ce = courseEnrichment.find(enrichment => enrichment.uuid === course.id)

    if (ce) {
      if (ce.data) {
        const d = ce.data

        // course length
        c.courseLength = d.CourseLength

        // fees
        c.feesUK = d.FeeUkEu

        if (d.FeeInternational) {
          c.feesInternational = d.FeeInternational
        }

        if (d.FeeDetails) {
          c.feeDetails = d.FeeDetails
        }

        if (d.FinancialSupport) {
          c.financialSupport = d.FinancialSupport
        }

        // course information
        c.aboutCourse = d.AboutCourse
        c.interviewProcess = d.InterviewProcess
        c.howSchoolPlacementsWork = d.HowSchoolPlacementsWork

        // requirements and eligibility
        c.personalQualities = d.PersonalQualities
        c.otherRequirements = d.OtherRequirements
      }

      c.status = ce.status

      c.createdAt = ce.created_at

      if (ce.updated_at || ce.updated_at !== null) {
        c.updatedAt = ce.updated_at
      }
    }

    // if (c.trainingProvider) {
    //   // write course data to file
    //   const directoryPath = path.join(__dirname, '../data/seed/courses/' + c.trainingProvider.id)
    //
    //   // check if document directory exists
    //   if (!fs.existsSync(directoryPath)) {
    //     fs.mkdirSync(directoryPath)
    //   }
    //
    //   const raw = JSON.stringify(c)
    //
    //   const fileName = c.id + '.json'
    //   const filePath = directoryPath + '/' + fileName
    //
    //   // write the JSON data
    //   fs.writeFileSync(filePath, raw)
    // }

    // output course info
    console.log(i, c)

  })


}
