const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

const faker = require('faker')
faker.locale = 'en_GB'

const subjects = require('../data/seed/subjects')

const utilsHelper = require('../helpers/utils')

const organisationModel = require('./organisations')

const findUUIDs = () => {
  const courses = []
  const oDirectoryPath = path.join(__dirname, '../data/dist/seed/organisations/')

  const salaryDetails = require('../data/temp/salary-details')

  let oDocuments = fs.readdirSync(oDirectoryPath, 'utf8')
  // Only get JSON documents
  oDocuments = oDocuments.filter(doc => doc.match(/.*\.(json)/ig))

  oDocuments.forEach((oFileName) => {

    const oFilePath = oDirectoryPath + '/' + oFileName
    const oRaw = fs.readFileSync(oFilePath)
    const organisation = JSON.parse(oRaw)

    const cDirectoryPath = path.join(__dirname, '../data/dist/seed/courses/' + organisation.id)

    // check if document directory exists
    if (!fs.existsSync(cDirectoryPath)) {
      fs.mkdirSync(cDirectoryPath)
    }

    let cDocuments = fs.readdirSync(cDirectoryPath, 'utf8')

    // Only get JSON documents
    cDocuments = cDocuments.filter(doc => doc.match(/.*\.(json)/ig))

    cDocuments.forEach((cFileName) => {
      const cFilePath = cDirectoryPath + '/' + cFileName
      const cRaw = fs.readFileSync(cFilePath)
      const course = JSON.parse(cRaw)

      if (course.fundingType === 'salary') {
        const details = salaryDetails.find(salaryDetail => salaryDetail.id === course.id)
        console.log(course.id)

        if (details?.data) {
          course.salaryDetails = details.data.SalaryDetails
          console.log(details.data.SalaryDetails)

          // create a JSON string for the course data
          const cFileData = JSON.stringify(course)

          // write the JSON data
          // fs.writeFileSync(cFilePath, cFileData)

        } else {
          console.log('No salary details')
        }

        console.log('----------------------------------------');
        // courses.push(course.id)
      }
    })

  })

  // console.log(courses);

}


exports.seed = () => {
  findUUIDs()
  // seedLocations()
  // seedOrganisations()
  // seedCourses()
  // seedRelationships()
  // seedCourseVisaSponsorship()
  // seedUsers()
  // seedFundingType()
}

const seedFundingType = () => {
  const oDirectoryPath = path.join(__dirname, '../data/dist/seed/organisations/')

  let oDocuments = fs.readdirSync(oDirectoryPath, 'utf8')

  // Only get JSON documents
  oDocuments = oDocuments.filter(doc => doc.match(/.*\.(json)/ig))

  oDocuments.forEach((oFileName) => {
    const oFilePath = oDirectoryPath + '/' + oFileName
    const oRaw = fs.readFileSync(oFilePath)
    const organisation = JSON.parse(oRaw)

    // console.log(oFileName);

    const cDirectoryPath = path.join(__dirname, '../data/dist/seed/courses/' + organisation.id)

    // check if document directory exists
    if (!fs.existsSync(cDirectoryPath)) {
      fs.mkdirSync(cDirectoryPath)
    }

    let cDocuments = fs.readdirSync(cDirectoryPath, 'utf8')

    // Only get JSON documents
    cDocuments = cDocuments.filter(doc => doc.match(/.*\.(json)/ig))

    cDocuments.forEach((cFileName) => {
      const cFilePath = cDirectoryPath + '/' + cFileName
      const cRaw = fs.readFileSync(cFilePath)
      const course = JSON.parse(cRaw)

      if (!course.fundingType) {
        if (course.trainingProvider) {
          const o = organisationModel.findOne({ organisationId: course.trainingProvider.id })

          if (o.visaSponsorship) {
            if (course.programType === 'SC') {
              course.fundingType = 'fee'
              course.canSponsorStudentVisa = o.visaSponsorship.canSponsorStudentVisa
              delete course.canSponsorSkilledWorkerVisa
              // console.log(course);
            }

            if (course.programType === 'HE') {
              course.fundingType = 'fee'
              course.canSponsorStudentVisa = o.visaSponsorship.canSponsorStudentVisa
              delete course.canSponsorSkilledWorkerVisa
              // console.log(course);
            }

            // create a JSON string for the course data
            const cFileData = JSON.stringify(course)

            // write the JSON data
            // fs.writeFileSync(cFilePath, cFileData)

            console.log(cFilePath)
          }
        }
      }
    })
  })
}

const seedUsers = () => {
  const directoryPath = path.join(__dirname, '../data/dist/seed/users/')

  let documents = fs.readdirSync(directoryPath, 'utf8')

  // Only get JSON documents
  documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

  documents.forEach((fileName) => {
    const filePath = directoryPath + '/' + fileName
    const raw = fs.readFileSync(filePath)
    const user = JSON.parse(raw)

    user.organisations.forEach((organisation, i) => {
      const o = organisationModel.findOne({ organisationId: organisation.id })

      if (['hei', 'scitt'].includes(o.type)) {
        organisation.notifications = [
          'course_published',
          'course_changed',
          'course_withdrawn',
          'course_vacancies_changed',
          'course_published_training_provider',
          'course_changed_training_provider',
          'course_withdrawn_training_provider',
          'course_vacancies_changed_training_provider'
        ]
      } else {
        organisation.notifications = [
          'course_published',
          'course_changed',
          'course_withdrawn',
          'course_vacancies_changed'
        ]
      }
      // console.log(organisation);
    })

    // create a JSON sting for the submitted data
    const fileData = JSON.stringify(user)

    // write the JSON data
    // fs.writeFileSync(filePath, fileData)

    // console.log(filePath);
    console.log(user)
  })
}

// const seedUsers = () => {
//   const users = require('../data/seed/users')
//
//   users.forEach((u, i) => {
//     const user = {}
//
//     user.id = u.id
//     user.firstName = u.firstName
//     user.lastName = u.lastName
//
//     user.email = u.email
//
//     user.username = u.username
//     user.password = u.password
//
//     user.organisations = []
//
//     u.organisations.forEach((o, i) => {
//       const organisation = {}
//
//       organisation.id = o.id
//       organisation.code = o.code
//       organisation.name = o.name
//       organisation.permissions = o.roles
//
//       user.organisations.push(organisation)
//     })
//
//     user.notifications = []
//
//     user.createdAt = u.createdAt
//     user.updatedAt = new Date()
//
//     if (!u.active) {
//       user.active = faker.datatype.boolean()
//     }
//
//     if (user && user.id) {
//       // write course data to file
//       const directoryPath = path.join(__dirname, '../data/dist/seed/users/')
//
//       // check if document directory exists
//       if (!fs.existsSync(directoryPath)) {
//         fs.mkdirSync(directoryPath)
//       }
//
//       const raw = JSON.stringify(user)
//
//       const fileName = user.id + '.json'
//       const filePath = directoryPath + '/' + fileName
//
//       // write the JSON data
//       // fs.writeFileSync(filePath, raw)
//
//       // output user info
//       console.log(i, user)
//     }
//
//   })
//
//
// }

// const seedUsers = () => {
//   const users = []
//   const tempDirectoryPath = path.join(__dirname, '../data/dist/temp/users')
//
//   const tempUsers = require('../data/temp/users')
//   const prototypeUsers = require('../data/temp/prototype-users')
//
//   tempUsers.forEach((tUser, i) => {
//     const user = {}
//
//     user.id = uuid()
//     user.firstName = faker.name.firstName()
//     user.lastName = faker.name.lastName()
//
//     // tidy up the names for email
//     const emailFirstName = utilsHelper.slugify(user.firstName)
//     const emailLastName = utilsHelper.slugify(user.lastName)
//
//     user.email = `${emailFirstName}.${emailLastName}-${tUser.id}@example.com`
//
//     user.username = user.email
//     user.password = 'bat'
//
//     user.organisations = []
//
//     tUser.providers.forEach((tProvider, i) => {
//       const organisation = {}
//
//       const o = organisationModel.findMany({ code: tProvider.code })
//
//       try {
//         organisation.id = o.id
//         organisation.code = o.code
//         organisation.name = o.name
//
//         if (tProvider.isAdmin) {
//           organisation.roles = ['admin']
//         } else {
//           organisation.roles = []
//         }
//
//         user.organisations.push(organisation)
//       } catch (e) {
//         console.log(tProvider.code)
//       }
//
//     })
//
//     user.active = false
//     user.createdAt = new Date()
//
//     // console.log(user)
//
//     users.push(user)
//   })
//
//   users = [...prototypeUsers, ...users]
//
//   // if (users) {
//   //   // write course data to file
//   //   const directoryPath = path.join(__dirname, '../data/dist/seed/')
//   //   const raw = JSON.stringify(users)
//   //   const fileName = 'users.json'
//   //   const filePath = directoryPath + '/' + fileName
//   //   // write the JSON data
//   //   fs.writeFileSync(filePath, raw)
//   // }
//
// }

const seedCourseVisaSponsorship = () => {
  const organisations = []
  const oDirectoryPath = path.join(__dirname, '../data/dist/seed/organisations')

  let oDocuments = fs.readdirSync(oDirectoryPath, 'utf8')

  // Only get JSON documents
  oDocuments = oDocuments.filter(doc => doc.match(/.*\.(json)/ig))

  oDocuments.forEach((filename) => {
    const raw = fs.readFileSync(oDirectoryPath + '/' + filename)
    const organisation = JSON.parse(raw)
    // organisations.push(organisation)

    console.log('==============================')
    console.log('Organisation: ', organisation.id)

    if (organisation.id) {
      const cDirectoryPath = path.join(__dirname, '../data/dist/seed/courses/' + organisation.id)

      // not all organisations have courses, so wrap with try/catch
      try {
        let cDocuments = fs.readdirSync(cDirectoryPath, 'utf8')

        // Only get JSON documents
        cDocuments = cDocuments.filter(doc => doc.match(/.*\.(json)/ig))

        cDocuments.forEach((filename) => {
          const raw = fs.readFileSync(cDirectoryPath + '/' + filename)
          const course = JSON.parse(raw)

          if (organisation.isAccreditedBody) {
            if (organisation.visaSponsorship) {
              if (course.fundingType === 'fee') {
                course.canSponsorStudentVisa = organisation.visaSponsorship.canSponsorStudentVisa
              } else {
                course.canSponsorSkilledWorkerVisa = organisation.visaSponsorship.canSponsorSkilledWorkerVisa
              }
            }
          } else {
            const accreditedBodyRaw = fs.readFileSync(oDirectoryPath + '/' + course.accreditedBody.id + '.json')
            const accreditedBody = JSON.parse(accreditedBodyRaw)

            if (accreditedBody.visaSponsorship) {
              if (course.fundingType === 'fee') {
                course.canSponsorStudentVisa = accreditedBody.visaSponsorship.canSponsorStudentVisa
              } else {
                course.canSponsorSkilledWorkerVisa = accreditedBody.visaSponsorship.canSponsorSkilledWorkerVisa
              }
            }
          }

          // course.cycle = '2022'
          //
          // let applicationsOpenDate = course.applicationsOpenDate
          //
          // if (applicationsOpenDate !== '2021-10-12T00:00:00.000Z') {
          //   course.applicationsOpenDate = 'other'
          //   course.applicationsOpenDateOther = applicationsOpenDate
          // }

          console.log('Course: ', course.id)

          // write course data to file
          // if (course) {
          //   // check if document directory exists
          //   if (!fs.existsSync(cDirectoryPath)) {
          //     fs.mkdirSync(cDirectoryPath)
          //   }
          //
          //   const raw = JSON.stringify(course)
          //
          //   const fileName = course.id + '.json'
          //   const filePath = cDirectoryPath + '/' + fileName
          //
          //   // write the JSON data
          //   fs.writeFileSync(filePath, raw)
          // }
        })
      } catch (e) {
        console.error(e)
      }
    }
  })
}

const seedRelationships = () => {
  console.log('Seed organisations')

  const organisations = require('../data/seed/temp/organisations')
  const relationships = require('../data/seed/temp/organisation-relationships')

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
  //   const directoryPath = path.join(__dirname, '../data/dist/seed/temp/')
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

// {
//   "id": "82fd3a3b-6bfd-40d1-8343-0c19e34a847a",
//   "name": "2Schools Consortium",
//   "code": "T92",
//   "type": "scitt",
//   "ukprn": "10045988",
//   "address": {
//     "addressLine1": "Oakthorpe Primary School",
//     "addressLine2": "c/o Tile Kiln Lane",
//     "town": "Palmers Green",
//     "county": "London",
//     "postcode": "N13 6BY"
//   },
//   "url": "http://www.2schools.org/",
//   "email": "training@oakthorpe.enfield.sch.uk",
//   "telephone": "02088076906",
//   "isAccreditedBody": true
// }

const seedOrganisations = () => {
  console.log('Seed organisations')

  const organisations = require('../data/seed/temp/organisations')
  const relationships = require('../data/seed/temp/relationships')
  const tempOrganisations = require('../data/seed/temp/temp-organisations')

  organisations.forEach((organisation, i) => {
    const o = {}

    const to = tempOrganisations.find(org => org.code === organisation.code)

    o.id = organisation.id
    o.name = organisation.name
    o.code = organisation.code
    o.type = organisation.type
    o.isAccreditedBody = organisation.isAccreditedBody

    if (organisation.urn) {
      o.urn = organisation.urn
    }

    o.ukprn = organisation.ukprn

    o.address = organisation.address

    o.contact = to.contact

    o.location = to.location

    if (to.trainWithUs) {
      o.trainWithUs = to.trainWithUs
    }

    if (to.trainWithDisability) {
      o.trainWithDisability = to.trainWithDisability
    }

    // if (to.enrichments) {
    //   if (to.enrichments[0].Description) {
    //     o.description = to.enrichments[0].Description
    //   }
    // }

    o.visaSponsorship = to.visas

    if (!organisation.isAccreditedBody) {
      const r = relationships.find(rel => rel.code === organisation.code)

      o.accreditedBodies = r.accreditedBodies
    }

    o.createdAt = to.createdAt
    o.updatedAt = to.updatedAt

    // if (o) {
    //   // write course data to file
    //   const directoryPath = path.join(__dirname, '../data/dist/seed/organisations/')
    //
    //   // check if document directory exists
    //   if (!fs.existsSync(directoryPath)) {
    //     fs.mkdirSync(directoryPath)
    //   }
    //
    //   const raw = JSON.stringify(o)
    //
    //   const fileName = o.id + '.json'
    //   const filePath = directoryPath + '/' + fileName
    //
    //   // write the JSON data
    //   fs.writeFileSync(filePath, raw)
    // }

    // output organisation info
    console.log(i, o)
  })
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
    //   const directoryPath = path.join(__dirname, '../data/dist/seed/locations/' + o.id)
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
    console.log(i, l)
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

  courseEnrichment.sort((a, b) => {
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

    if (['SD', 'SS', 'TA'].includes(course.programType)) {
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
    //   const directoryPath = path.join(__dirname, '../data/dist/seed/courses/' + c.trainingProvider.id)
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
