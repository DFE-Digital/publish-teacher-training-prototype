var basicAuth = require('basic-auth')
var config = require('../app/config.js')
var fs = require('fs')
var marked = require('marked')
var path = require('path')
var portScanner = require('portscanner')
var prompt = require('prompt')
var request = require('sync-request')

// Variables
var releaseUrl = null

// require core and custom filters, merges to one object
// and then add the methods to nunjucks env obj
exports.addNunjucksFilters = function (env) {
  var coreFilters = require('./core_filters.js')(env)
  var customFilters = require('../app/filters.js')(env)
  var filters = Object.assign(coreFilters, customFilters)
  Object.keys(filters).forEach(function (filterName) {
    env.addFilter(filterName, filters[filterName])
  })
}

/**
 * Simple basic auth middleware for use with Express 4.x.
 *
 * Based on template found at: http://www.danielstjules.com/2014/08/03/basic-auth-with-express-4/
 *
 * @example
 * app.use('/api-requiring-auth', utils.basicAuth('username', 'password'))
 *
 * @param   {string}   username Expected username
 * @param   {string}   password Expected password
 * @returns {function} Express 4 middleware requiring the given credentials
 */

exports.basicAuth = function (username, password) {
  return function (req, res, next) {
    if (!username || !password) {
      console.log('Username or password is not set.')
      return res.send('<h1>Error:</h1><p>Username or password not set. <a href="https://govuk-prototype-kit.herokuapp.com/docs/publishing-on-heroku#5-set-a-username-and-password">See guidance for setting these</a>.</p>')
    }

    var user = basicAuth(req)

    if (!user || user.name !== username || user.pass !== password) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
      return res.sendStatus(401)
    }

    next()
  }
}

exports.findAvailablePort = function (app, callback) {
  var port = null

  try {
    port = Number(fs.readFileSync(path.join(__dirname, '/../.port.tmp')))
  } catch (e) {
    port = Number(process.env.PORT || config.port)
  }

  console.log('')

  // Check that default port is free, else offer to change
  portScanner.findAPortNotInUse(port, port + 50, '127.0.0.1', function (error, availablePort) {
    if (error) { throw error }
    if (port === availablePort) {
      callback(port)
    } else {
      // Default port in use - offer to change to available port
      console.error('ERROR: Port ' + port + ' in use - you may have another prototype running.\n')
      // Set up prompt settings
      prompt.colors = false
      prompt.start()
      prompt.message = ''
      prompt.delimiter = ''

      // Ask user if they want to change port
      prompt.get([{
        name: 'answer',
        description: 'Change to an available port? (y/n)',
        required: true,
        type: 'string',
        pattern: /y(es)?|no?/i,
        message: 'Please enter y or n'
      }], function (err, result) {
        if (err) { throw err }
        if (result.answer.match(/y(es)?/i)) {
          // User answers yes
          port = availablePort
          fs.writeFileSync(path.join(__dirname, '/../.port.tmp'), port)
          console.log('Changed to port ' + port)

          callback(port)
        } else {
          // User answers no - exit
          console.log('\nYou can set a new default port in server.js, or by running the server with PORT=XXXX')
          console.log("\nExit by pressing 'ctrl + c'")
          process.exit(0)
        }
      })
    }
  })
}

exports.forceHttps = function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    console.log('Redirecting request to https')
    // 302 temporary - this is a feature that can be disabled
    return res.redirect(302, 'https://' + req.get('Host') + req.url)
  }
  next()
}

// Synchronously get the url for the latest release on github and store
exports.getLatestRelease = function () {
  var url = ''

  if (releaseUrl !== null) {
    // Release url already exists
    console.log('Release url cached:', releaseUrl)
    return releaseUrl
  } else {
    // Release url doesn't exist
    var options = {
      headers: {'user-agent': 'node.js'}
    }
    var gitHubUrl = 'https://api.github.com/repos/alphagov/govuk_prototype_kit/releases/latest'
    try {
      console.log('Getting latest release from github')

      var res = request('GET', gitHubUrl, options)
      var data = JSON.parse(res.getBody('utf8'))
      var zipballUrl = data['zipball_url']
      var releaseVersion = zipballUrl.split('/').pop()
      var urlStart = 'https://github.com/alphagov/govuk_prototype_kit/archive/'
      var urlEnd = '.zip'
      var zipUrl = urlStart + releaseVersion + urlEnd

      console.log('Release url is', zipUrl)
      releaseUrl = zipUrl
      url = releaseUrl
    } catch (err) {
      url = 'https://github.com/alphagov/govuk_prototype_kit/releases/latest'
      console.log("Couldn't retrieve release url")
    }
  }
  return url
}

// Matches routes
exports.matchRoutes = function (req, res) {
  var path = (req.params[0])
  res.render(path, function (err, html) {
    if (err) {
      res.render(path + '/index', function (err2, html) {
        if (err2) {
          res.status(404).send(err + '<br>' + err2)
        } else {
          res.end(html)
        }
      })
    } else {
      res.end(html)
    }
  })
}

exports.matchMdRoutes = function (req, res) {
  var docsPath = '/../docs/documentation/'
  if (fs.existsSync(path.join(__dirname, docsPath, req.params[0] + '.md'), 'utf8')) {
    var doc = fs.readFileSync(path.join(__dirname, docsPath, req.params[0] + '.md'), 'utf8')
    var html = marked(doc)
    res.render('documentation_template', {'document': html})
    return true
  }
  return false
}

// store data from POST body or GET query in session

var storeData = function (input, store) {
  for (var i in input) {
    // any input where the name starts with _ is ignored
    if (i.indexOf('_') === 0) {
      continue
    }

    var val = input[i]

    // delete single unchecked checkboxes
    if (val === '_unchecked' || val === ['_unchecked']) {
      delete store.data[i]
      continue
    }

    // remove _unchecked from arrays
    if (Array.isArray(val)) {
      var index = val.indexOf('_unchecked')
      if (index !== -1) {
        val.splice(index, 1)
      }
    }

    store.data[i] = val
  }
}

// Middleware - store any data sent in session, and pass it to all views

exports.autoStoreData = function (req, res, next) {
  if (!req.session.data) {
    req.session.data = {
      'chemistry-about-this-course': 'The course will help you to develop the professional skills and knowledge you need to teach chemistry in schools or colleges, as part of both academic (A Level and GCSE) and applied courses.  It will also build on your knowledge of contemporary issues in education, and your understanding of how to support effective learning for all pupils of all abilities.',
      'chemistry-qualifications-required': '2:2 class degree in chemistry or a related subject. Preference will normally be given to candidates with upper second class honours, or to those who have supplemented their lower second class first degrees with a masters or doctoral qualification.',
      'chemistry-other-requirements': 'You will ideally have some experience observing lessons and of working with young people, eg through volunteering, youth clubs, sports teams.',
      'chemistry-training-with-a-disability': 'Disability access varies across the alliance sites. Please contact individual schools for further information.',
      'chemistry-interview-process': 'Two stage interview process - at school and at university, involving interviews, sample lesson, subject knowledge tests.',
      'chemistry-placement-school-policy': 'On placement you will generally attend school 4 days per week, with 1 day spent at university. We aim to place each trainee in two contrasting schools, such that they have a varied experience and the best opportunities to develop a wide range of skills.  In Kingston we have a unique contrast of settings - selective, non-selective, all boys, all girls, mixed.',
      'chemistry-pgce-with-qts-qual-fee': '9,000',
      'chemistry-qts-qual-fee': '7,000',
      'chemistry-salary': '15,000',
      'chemistry-course-website': 'http://www.wltsa.org.uk/initial-teacher-training/',


      'folded_courses': [
        {
          "name": "Biology",
          "courses": 2,
          "accrediting": "St Mary's University, Twickenham",
          "applicationsOpen": [
            "26 Oct 2017"
          ],
          "schoolsWithVacancies": [
            "Fulham College Boys' School SW6 6SN",
            "Drayton Manor High School",
            "The Fulham Boys' School",
            "St Mark's Roman Catholic School",
            "William Morris Sixth Form"
          ],
          "options": [
            "PGCE with QTS, 1 year full time",
            "QTS, 1 year full time with salary"
          ],
          "flags": {
            "partTime": false,
            "salary": true,
            "qualifications": true
          }
        },
        {
          "name": "Business education",
          "courses": 1,
          "accrediting": "UCL, University College London (University of London",
          "applicationsOpen": [
            "26 Oct 2017"
          ],
          "schoolsWithVacancies": [
            "Drayton Manor High School"
          ],
          "options": [
            "PGCE with QTS, 1 year full time"
          ],
          "flags": {
            "partTime": false,
            "salary": false,
            "qualifications": false
          }
        },
        {
          "name": "Chemistry",
          "courses": 2,
          "accrediting": "St Mary's University, Twickenham",
          "applicationsOpen": [
            "26 Oct 2017"
          ],
          "schoolsWithVacancies": [
            "Sacred Heart High School",
            "Fulham College Boys' School SW6 6SN",
            "The Fulham Boys' School",
            "Lady Margaret School SW6 4UN",
            "St Mark's Roman Catholic School",
            "William Morris Sixth Form"
          ],
          "options": [
            "PGCE with QTS, 1 year full time",
            "QTS, 1 year full time with salary"
          ],
          "flags": {
            "partTime": false,
            "salary": true,
            "qualifications": true
          }
        },
        {
          "name": "Computer studies",
          "courses": 1,
          "accrediting": "Roehampton University",
          "applicationsOpen": [
            "26 Oct 2017"
          ],
          "schoolsWithVacancies": [
            "Drayton Manor High School"
          ],
          "options": [
            "PGCE with QTS, 1 year full time"
          ],
          "flags": {
            "partTime": false,
            "salary": false,
            "qualifications": false
          }
        },
        {
          "name": "Design and technology",
          "courses": 1,
          "accrediting": "Roehampton University",
          "applicationsOpen": [
            "26 Oct 2017"
          ],
          "schoolsWithVacancies": [
            "Sacred Heart High School",
            "Fulham Cross Girls' School"
          ],
          "options": [
            "PGCE with QTS, 1 year full time"
          ],
          "flags": {
            "partTime": false,
            "salary": false,
            "qualifications": false
          }
        },
        {
          "name": "Drama and theatre studies",
          "courses": 1,
          "accrediting": "Roehampton University",
          "applicationsOpen": [
            "26 Oct 2017"
          ],
          "schoolsWithVacancies": [
            "Sacred Heart High School",
            "The Fulham Boys' School"
          ],
          "options": [
            "PGCE with QTS, 1 year full time"
          ],
          "flags": {
            "partTime": false,
            "salary": false,
            "qualifications": false
          }
        },
        {
          "name": "English",
          "courses": 2,
          "accrediting": "St Mary's University, Twickenham",
          "applicationsOpen": [
            "26 Oct 2017"
          ],
          "schoolsWithVacancies": [
            "Sacred Heart High School",
            "Fulham Cross Girls' School",
            "Fulham College Boys' School SW6 6SN",
            "Chelsea Academy SW10 0AB",
            "Drayton Manor High School",
            "The Fulham Boys' School",
            "Hammersmith Academy W12 9JD",
            "Lady Margaret School SW6 4UN",
            "St Mark's Roman Catholic School"
          ],
          "options": [
            "PGCE with QTS, 1 year full time",
            "QTS, 1 year full time with salary"
          ],
          "flags": {
            "partTime": false,
            "salary": true,
            "qualifications": true
          }
        },
        {
          "name": "French and spanish",
          "courses": 1,
          "accrediting": "St Mary's University, Twickenham",
          "applicationsOpen": [
            "26 Oct 2017"
          ],
          "schoolsWithVacancies": [
            "Sacred Heart High School",
            "Fulham Cross Girls' School",
            "Chelsea Academy SW10 0AB"
          ],
          "options": [
            "PGCE with QTS, 1 year full time"
          ],
          "flags": {
            "partTime": false,
            "salary": false,
            "qualifications": false
          }
        },
        {
          "name": "Geography",
          "courses": 1,
          "accrediting": "St Mary's University, Twickenham",
          "applicationsOpen": [
            "26 Oct 2017",
            "07 Dec 2017"
          ],
          "schoolsWithVacancies": [
            "Sacred Heart High School",
            "Chelsea Academy SW10 0AB",
            "Drayton Manor High School",
            "The Fulham Boys' School",
            "Hammersmith Academy W12 9JD"
          ],
          "options": [
            "PGCE with QTS, 1 year full time"
          ],
          "flags": {
            "partTime": false,
            "salary": false,
            "qualifications": false
          }
        },
        {
          "name": "History",
          "courses": 1,
          "accrediting": "St Mary's University, Twickenham",
          "applicationsOpen": [
            "26 Oct 2017"
          ],
          "schoolsWithVacancies": [
            "Sacred Heart High School",
            "Chelsea Academy SW10 0AB"
          ],
          "options": [
            "PGCE with QTS, 1 year full time"
          ],
          "flags": {
            "partTime": false,
            "salary": false,
            "qualifications": false
          }
        },
        {
          "name": "Mathematics",
          "courses": 2,
          "accrediting": "St Mary's University, Twickenham",
          "applicationsOpen": [
            "26 Oct 2017"
          ],
          "schoolsWithVacancies": [
            "Sacred Heart High School",
            "Fulham Cross Girls' School",
            "Fulham College Boys' School SW6 6SN",
            "Chelsea Academy SW10 0AB",
            "Drayton Manor High School",
            "The Fulham Boys' School",
            "Hammersmith Academy W12 9JD",
            "St Mark's Roman Catholic School",
            "William Morris Sixth Form"
          ],
          "options": [
            "PGCE with QTS, 1 year full time",
            "QTS, 1 year full time with salary"
          ],
          "flags": {
            "partTime": false,
            "salary": true,
            "qualifications": true
          }
        },
        {
          "name": "Physical education",
          "courses": 1,
          "accrediting": "St Mary's University, Twickenham",
          "applicationsOpen": [
            "26 Oct 2017"
          ],
          "schoolsWithVacancies": [
            "Sacred Heart High School"
          ],
          "options": [
            "PGCE with QTS, 1 year full time"
          ],
          "flags": {
            "partTime": false,
            "salary": false,
            "qualifications": false
          }
        },
        {
          "name": "Physics",
          "courses": 2,
          "accrediting": "St Mary's University, Twickenham",
          "applicationsOpen": [
            "26 Oct 2017"
          ],
          "schoolsWithVacancies": [
            "Sacred Heart High School",
            "Fulham College Boys' School SW6 6SN",
            "Drayton Manor High School",
            "The Fulham Boys' School",
            "Hammersmith Academy W12 9JD",
            "Lady Margaret School SW6 4UN",
            "St Mark's Roman Catholic School"
          ],
          "options": [
            "PGCE with QTS, 1 year full time",
            "QTS, 1 year full time with salary"
          ],
          "flags": {
            "partTime": false,
            "salary": true,
            "qualifications": true
          }
        },
        {
          "name": "Psychology",
          "courses": 1,
          "accrediting": "UCL, University College London (University of London",
          "applicationsOpen": [
            "26 Oct 2017"
          ],
          "schoolsWithVacancies": [
            "Chelsea Academy SW10 0AB"
          ],
          "options": [
            "PGCE with QTS, 1 year full time"
          ],
          "flags": {
            "partTime": false,
            "salary": false,
            "qualifications": false
          }
        },
        {
          "name": "Religious education",
          "courses": 2,
          "accrediting": "St Mary's University, Twickenham",
          "applicationsOpen": [
            "26 Oct 2017"
          ],
          "schoolsWithVacancies": [
            "Sacred Heart High School",
            "Chelsea Academy SW10 0AB",
            "St Mark's Roman Catholic School",
            "The Fulham Boys' School"
          ],
          "options": [
            "PGCE with QTS, 1 year full time",
            "QTS, 1 year full time with salary"
          ],
          "flags": {
            "partTime": false,
            "salary": true,
            "qualifications": true
          }
        }
      ],
      'subjects': [
        {
          url: '/course/biology',
          subject: 'Biology',
          schools: []
        },
        {
          url: '/course/business-education',
          subject: 'Business education',
          schools: []
        },
        {
          url: '/course/chemistry',
          subject: 'Chemistry',
          schools: []
        },
        {
          url: '/course/computer-studies',
          subject: 'Computer studies',
          schools: []
        },
        {
          url: '/course/design-and-technology',
          subject: 'Design and technology',
          schools: []
        },
        {
          url: '/course/drama-and-theatre-studies',
          subject: 'Drama and theatre studies',
          schools: []
        },
        {
          url: '/course/english',
          subject: 'English',
          schools: []
        },
        {
          url: '/course/french-and-spanish',
          subject: 'French and Spanish',
          schools: []
        },
        {
          url: '/course/geography',
          subject: 'Geography',
          schools: []
        },
        {
          url: '/course/history',
          subject: 'History',
          schools: []
        },
        {
          url: '/course/mathematics',
          subject: 'Mathematics',
          schools: []
        },
        {
          url: '/course/physical-education',
          subject: 'Physical education',
          schools: []
        },
        {
          url: '/course/psychology',
          subject: 'Psychology',
          schools: []
        },
        {
          url: '/course/religious-education',
          subject: 'Religious education',
          schools: []
        }
      ],
      'provider-code-name': 'A2598',
      'provider-code': '2BV',
      'training-provider-name': 'West London Teaching School Alliance (Secondary)',
      'address-line-1': '123 Baker Street',
      'town': 'London',
      'postcode': 'SW1 1AA',
      'telephone': '0208 123 4567',
      'email': 'someemail@not-an-email.com',
      'website': 'http://www.wltsa.org.uk/',

      'schools': [
        {
          "name": "Fulham College Boys' School",
          "code": "4",
          "address": "Kingswood Road, London, SW6 6SN"
        },
        {
          "name": "Drayton Manor High School",
          "code": "D",
          "address": "Drayton Bridge Road, London, W7 1EU"
        },
        {
          "name": "The Fulham Boys' School",
          "code": "F",
          "address": "Mund Street, Gibbs Green, London, W14 9LY"
        },
        {
          "name": "St Mark's Roman Catholic School",
          "code": "M",
          "address": "106 Bath Road, Hounslow, TW3 3EJ"
        },
        {
          "name": "William Morris Sixth Form",
          "code": "W",
          "address": "St Dunstan's Road, London, W6 8RB"
        },
        {
          "name": "Sacred Heart High School",
          "code": "1",
          "address": "212 Hammersmith Road, London, W6 7DG"
        },
        {
          "name": "Lady Margaret School",
          "code": "L",
          "address": "Parsons Green, London, SW6 4UN"
        },
        {
          "name": "Fulham Cross Girls' School",
          "code": "3",
          "address": "Munster Road, Fulham, SW6 6BP"
        },
        {
          "name": "Chelsea Academy",
          "code": "C",
          "address": "Lots Road, Chelsea, London, SW10 0AB"
        },
        {
          "name": "Hammersmith Academy",
          "code": "H",
          "address": "25 Cathnor Road, Hammersmith, London, W12 9JD"
        }
      ],
      ucasCourses: [
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "Biology, Science, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Biology",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate, Professional",
          "providerCode": "2BV",
          "programmeCode": "2XVC",
          "schools": [
            {
              "name": "Fulham College Boys' School SW6 6SN",
              "address": "Kingswood Road, London, SW6 6SN",
              "code": "4"
            },
            {
              "name": "Drayton Manor High School",
              "address": "Drayton Bridge Road, London, W7 1EU",
              "code": "D"
            },
            {
              "name": "The Fulham Boys' School",
              "address": "Mund Street, Gibbs Green, London, W14 9LY",
              "code": "F"
            },
            {
              "name": "St Mark's Roman Catholic School",
              "address": "106 Bath Road, Hounslow, TW3 3EJ",
              "code": "M"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "Biology, Science, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Biology",
          "route": "School Direct training programme (salaried)",
          "qualifications": "QTS",
          "providerCode": "2BV",
          "programmeCode": "36B5",
          "schools": [
            {
              "name": "The Fulham Boys' School",
              "address": "Mund Street, Gibbs Green, London, W14 9LY",
              "code": "F"
            },
            {
              "name": "William Morris Sixth Form",
              "address": "St Dunstan's Road, London, W6 8RB",
              "code": "W"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "UCL, University College London (University of London",
          "subjects": "Business education, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Business education",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate",
          "providerCode": "2BV",
          "programmeCode": "37W9",
          "schools": [
            {
              "name": "Drayton Manor High School",
              "address": "Drayton Bridge Road, London, W7 1EU",
              "code": "D"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "Chemistry, Science, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Chemistry",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate, Professional",
          "providerCode": "2BV",
          "programmeCode": "2XVD",
          "schools": [
            {
              "name": "Sacred Heart High School",
              "address": "212 Hammersmith Road, London, W6 7DG",
              "code": "1"
            },
            {
              "name": "Fulham College Boys' School SW6 6SN",
              "address": "Kingswood Road, London, SW6 6SN",
              "code": "4"
            },
            {
              "name": "The Fulham Boys' School",
              "address": "Mund Street, Gibbs Green, London, W14 9LY",
              "code": "F"
            },
            {
              "name": "Lady Margaret School SW6 4UN",
              "address": "Parsons Green, London, SW6 4UN",
              "code": "L"
            },
            {
              "name": "St Mark's Roman Catholic School",
              "address": "106 Bath Road, Hounslow, TW3 3EJ",
              "code": "M"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "Chemistry, Science, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Chemistry",
          "route": "School Direct training programme (salaried)",
          "qualifications": "QTS",
          "providerCode": "2BV",
          "programmeCode": "2XVH",
          "schools": [
            {
              "name": "The Fulham Boys' School",
              "address": "Mund Street, Gibbs Green, London, W14 9LY",
              "code": "F"
            },
            {
              "name": "William Morris Sixth Form",
              "address": "St Dunstan's Road, London, W6 8RB",
              "code": "W"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "Roehampton University",
          "subjects": "Computer studies, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Computer studies",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate, Professional",
          "providerCode": "2BV",
          "programmeCode": "36B7",
          "schools": [
            {
              "name": "Drayton Manor High School",
              "address": "Drayton Bridge Road, London, W7 1EU",
              "code": "D"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "Roehampton University",
          "subjects": "Design and technology, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Design and technology",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate, Professional",
          "providerCode": "2BV",
          "programmeCode": "2XX2",
          "schools": [
            {
              "name": "Sacred Heart High School",
              "address": "212 Hammersmith Road, London, W6 7DG",
              "code": "1"
            },
            {
              "name": "Fulham Cross Girls' School",
              "address": "Munster Road, Fulham, SW6 6BP",
              "code": "3"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "Roehampton University",
          "subjects": "Drama and theatre studies, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Drama and theatre studies",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate, Professional",
          "providerCode": "2BV",
          "programmeCode": "36BC",
          "schools": [
            {
              "name": "Sacred Heart High School",
              "address": "212 Hammersmith Road, London, W6 7DG",
              "code": "1"
            },
            {
              "name": "The Fulham Boys' School",
              "address": "Mund Street, Gibbs Green, London, W14 9LY",
              "code": "F"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "English, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "English",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate, Professional",
          "providerCode": "2BV",
          "programmeCode": "2XVJ",
          "schools": [
            {
              "name": "Sacred Heart High School",
              "address": "212 Hammersmith Road, London, W6 7DG",
              "code": "1"
            },
            {
              "name": "Fulham Cross Girls' School",
              "address": "Munster Road, Fulham, SW6 6BP",
              "code": "3"
            },
            {
              "name": "Fulham College Boys' School SW6 6SN",
              "address": "Kingswood Road, London, SW6 6SN",
              "code": "4"
            },
            {
              "name": "Chelsea Academy SW10 0AB",
              "address": "Lots Road, Chelsea, London, SW10 0AB",
              "code": "C"
            },
            {
              "name": "Drayton Manor High School",
              "address": "Drayton Bridge Road, London, W7 1EU",
              "code": "D"
            },
            {
              "name": "The Fulham Boys' School",
              "address": "Mund Street, Gibbs Green, London, W14 9LY",
              "code": "F"
            },
            {
              "name": "Hammersmith Academy W12 9JD",
              "address": "25 Cathnor Road, Hammersmith, London, W12 9JD",
              "code": "H"
            },
            {
              "name": "Lady Margaret School SW6 4UN",
              "address": "Parsons Green, London, SW6 4UN",
              "code": "L"
            },
            {
              "name": "St Mark's Roman Catholic School",
              "address": "106 Bath Road, Hounslow, TW3 3EJ",
              "code": "M"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "English, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "English",
          "route": "School Direct training programme (salaried)",
          "qualifications": "QTS",
          "providerCode": "2BV",
          "programmeCode": "2XVP",
          "schools": [
            {
              "name": "The Fulham Boys' School",
              "address": "Mund Street, Gibbs Green, London, W14 9LY",
              "code": "F"
            },
            {
              "name": "Hammersmith Academy W12 9JD",
              "address": "25 Cathnor Road, Hammersmith, London, W12 9JD",
              "code": "H"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "French, Languages, Languages (european), Secondary, Spanish",
          "ageRange": "Secondary (11+ years)",
          "name": "French and spanish",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate, Professional",
          "providerCode": "2BV",
          "programmeCode": "2XW5",
          "schools": [
            {
              "name": "Sacred Heart High School",
              "address": "212 Hammersmith Road, London, W6 7DG",
              "code": "1"
            },
            {
              "name": "Fulham Cross Girls' School",
              "address": "Munster Road, Fulham, SW6 6BP",
              "code": "3"
            },
            {
              "name": "Chelsea Academy SW10 0AB",
              "address": "Lots Road, Chelsea, London, SW10 0AB",
              "code": "C"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "Geography, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Geography",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate, Professional",
          "providerCode": "2BV",
          "programmeCode": "2XVS",
          "schools": [
            {
              "name": "Sacred Heart High School",
              "address": "212 Hammersmith Road, London, W6 7DG",
              "code": "1"
            },
            {
              "name": "Chelsea Academy SW10 0AB",
              "address": "Lots Road, Chelsea, London, SW10 0AB",
              "code": "C"
            },
            {
              "name": "Drayton Manor High School",
              "address": "Drayton Bridge Road, London, W7 1EU",
              "code": "D"
            },
            {
              "name": "The Fulham Boys' School",
              "address": "Mund Street, Gibbs Green, London, W14 9LY",
              "code": "F"
            },
            {
              "name": "Hammersmith Academy W12 9JD",
              "address": "25 Cathnor Road, Hammersmith, London, W12 9JD",
              "code": "H"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "History, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "History",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate, Professional",
          "providerCode": "2BV",
          "programmeCode": "2XVZ",
          "schools": [
            {
              "name": "Sacred Heart High School",
              "address": "212 Hammersmith Road, London, W6 7DG",
              "code": "1"
            },
            {
              "name": "Chelsea Academy SW10 0AB",
              "address": "Lots Road, Chelsea, London, SW10 0AB",
              "code": "C"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "Mathematics, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Mathematics",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate, Professional",
          "providerCode": "2BV",
          "programmeCode": "2XW2",
          "schools": [
            {
              "name": "Sacred Heart High School",
              "address": "212 Hammersmith Road, London, W6 7DG",
              "code": "1"
            },
            {
              "name": "Fulham Cross Girls' School",
              "address": "Munster Road, Fulham, SW6 6BP",
              "code": "3"
            },
            {
              "name": "Fulham College Boys' School SW6 6SN",
              "address": "Kingswood Road, London, SW6 6SN",
              "code": "4"
            },
            {
              "name": "Chelsea Academy SW10 0AB",
              "address": "Lots Road, Chelsea, London, SW10 0AB",
              "code": "C"
            },
            {
              "name": "Drayton Manor High School",
              "address": "Drayton Bridge Road, London, W7 1EU",
              "code": "D"
            },
            {
              "name": "The Fulham Boys' School",
              "address": "Mund Street, Gibbs Green, London, W14 9LY",
              "code": "F"
            },
            {
              "name": "Hammersmith Academy W12 9JD",
              "address": "25 Cathnor Road, Hammersmith, London, W12 9JD",
              "code": "H"
            },
            {
              "name": "St Mark's Roman Catholic School",
              "address": "106 Bath Road, Hounslow, TW3 3EJ",
              "code": "M"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "Mathematics, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Mathematics",
          "route": "School Direct training programme (salaried)",
          "qualifications": "QTS",
          "providerCode": "2BV",
          "programmeCode": "2XW3",
          "schools": [
            {
              "name": "The Fulham Boys' School",
              "address": "Mund Street, Gibbs Green, London, W14 9LY",
              "code": "F"
            },
            {
              "name": "Hammersmith Academy W12 9JD",
              "address": "25 Cathnor Road, Hammersmith, London, W12 9JD",
              "code": "H"
            },
            {
              "name": "William Morris Sixth Form",
              "address": "St Dunstan's Road, London, W6 8RB",
              "code": "W"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "Physical education, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Physical education",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate, Professional",
          "providerCode": "2BV",
          "programmeCode": "2Y38",
          "schools": [
            {
              "name": "Sacred Heart High School",
              "address": "212 Hammersmith Road, London, W6 7DG",
              "code": "1"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "Physics, Science, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Physics",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate, Professional",
          "providerCode": "2BV",
          "programmeCode": "2XW6",
          "schools": [
            {
              "name": "Sacred Heart High School",
              "address": "212 Hammersmith Road, London, W6 7DG",
              "code": "1"
            },
            {
              "name": "Fulham College Boys' School SW6 6SN",
              "address": "Kingswood Road, London, SW6 6SN",
              "code": "4"
            },
            {
              "name": "Drayton Manor High School",
              "address": "Drayton Bridge Road, London, W7 1EU",
              "code": "D"
            },
            {
              "name": "The Fulham Boys' School",
              "address": "Mund Street, Gibbs Green, London, W14 9LY",
              "code": "F"
            },
            {
              "name": "Hammersmith Academy W12 9JD",
              "address": "25 Cathnor Road, Hammersmith, London, W12 9JD",
              "code": "H"
            },
            {
              "name": "Lady Margaret School SW6 4UN",
              "address": "Parsons Green, London, SW6 4UN",
              "code": "L"
            },
            {
              "name": "St Mark's Roman Catholic School",
              "address": "106 Bath Road, Hounslow, TW3 3EJ",
              "code": "M"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "Physics, Science, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Physics",
          "route": "School Direct training programme (salaried)",
          "qualifications": "QTS",
          "providerCode": "2BV",
          "programmeCode": "2XW7",
          "schools": [
            {
              "name": "The Fulham Boys' School",
              "address": "Mund Street, Gibbs Green, London, W14 9LY",
              "code": "F"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "UCL, University College London (University of London",
          "subjects": "Psychology, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Psychology",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate",
          "providerCode": "2BV",
          "programmeCode": "36CJ",
          "schools": [
            {
              "name": "Chelsea Academy SW10 0AB",
              "address": "Lots Road, Chelsea, London, SW10 0AB",
              "code": "C"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "Religious education, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Religious education",
          "route": "School Direct training programme",
          "qualifications": "QTS, Postgraduate, Professional",
          "providerCode": "2BV",
          "programmeCode": "2XW8",
          "schools": [
            {
              "name": "Sacred Heart High School",
              "address": "212 Hammersmith Road, London, W6 7DG",
              "code": "1"
            },
            {
              "name": "Chelsea Academy SW10 0AB",
              "address": "Lots Road, Chelsea, London, SW10 0AB",
              "code": "C"
            },
            {
              "name": "St Mark's Roman Catholic School",
              "address": "106 Bath Road, Hounslow, TW3 3EJ",
              "code": "M"
            }
          ]
        },
        {
          "regions": "London",
          "accrediting": "St Mary's University, Twickenham",
          "subjects": "Religious education, Secondary",
          "ageRange": "Secondary (11+ years)",
          "name": "Religious education",
          "route": "School Direct training programme (salaried)",
          "qualifications": "QTS",
          "providerCode": "2BV",
          "programmeCode": "36CW",
          "schools": [
            {
              "name": "The Fulham Boys' School",
              "address": "Mund Street, Gibbs Green, London, W14 9LY",
              "code": "F"
            }
          ]
        }
      ]
    }
  }

  storeData(req.body, req.session)
  storeData(req.query, req.session)

  // send session data to all views

  res.locals.data = {}

  for (var j in req.session.data) {
    res.locals.data[j] = req.session.data[j]
  }

  next()
}
