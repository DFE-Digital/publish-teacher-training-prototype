const express = require('express')
const router = express.Router()
var {
  generateCourseCode,
  getGeneratedTitle,
  getCourseOffered,
  isModernLanguages,
  isFurtherEducation,
  newCourseWizardPaths,
  newFurtherEducationCourseWizardPaths,
  subject,
  course,
  validate,
  validateOrg
} = require('./utils')

// Route index page
router.all('/', function (req, res) {
  if (req.session.data['multi-organisation']) {
    res.render('your-organisations');
  } else {

    res.render('organisation', { justEditedVacancies: req.query.editedVacancies });
  }
})

router.get('/design-history', function (req, res) {
  res.redirect('/history');
})

router.get('/new/start', function (req, res) {
  var code = generateCourseCode();
  res.redirect('/new/' + code + '/phase');
})

router.all(['/new/:code/training-locations', '/new/:code/further/training-locations'], function (req, res) {
  var data = req.session.data;
  var code = req.params.code;
  var locations = [];

  data['schools'].forEach(school => {
    locations.push({
      name: school.name,
      text: school.address
    });
  });

  if (req.path.includes('further')) {
    paths = newFurtherEducationCourseWizardPaths(req);
  } else {
    paths = newCourseWizardPaths(req);
  }

  res.render('new/training-locations', {
    code: code,
    paths: paths,
    locations: locations
  });
})

router.all('/new/:code/title', function (req, res) {
  var data = req.session.data;
  var code = req.params.code;

  res.render('new/title', {
    code: code,
    paths: newCourseWizardPaths(req),
    generatedTitle: getGeneratedTitle(code, data)
  });
})

router.all('/new/:code/confirm', function (req, res) {
  var data = req.session.data;
  var code = req.params.code;

  res.render('new/confirm', {
    code: code,
    paths: newCourseWizardPaths(req),
    courseOffered: getCourseOffered(code, data)
  });
})

router.all('/new/:code/further/confirm', function (req, res) {
  var data = req.session.data;
  var code = req.params.code;

  res.render('new/further/confirm', {
    code: code,
    paths: newFurtherEducationCourseWizardPaths(req),
    courseOffered: getCourseOffered(code, data)
  });
})

router.all('/new/:code/edit', function (req, res) {
  var data = req.session.data;
  var code = req.params.code;

  res.render('new/edit', {
    code: code,
    paths: newCourseWizardPaths(req),
    courseOffered: getCourseOffered(code, data)
  });
})

router.post('/new/:code/subject', function (req, res) {
  var code = req.params.code;
  var data = req.session.data;

  if (isFurtherEducation(code, data)) {
    res.redirect('/new/' + code + '/further/title');
  } else {
    res.render('new/subject', {
      code: code,
      paths: newCourseWizardPaths(req)
    });
  }
})

router.post('/new/:code/languages', function (req, res) {
  var code = req.params.code;
  var data = req.session.data;
  var paths = newCourseWizardPaths(req);

  if (isModernLanguages(code, data)) {
    res.render('new/languages', {
      code: code,
      paths: paths
    });
  } else {
    res.redirect(paths.next);
  }
})

// Take new data and make it into a course
router.all(['/new/:code/create', '/new/:code/further/create'], function (req, res) {
  var data = req.session.data;
  var code = req.params.code;
  var languages = [];

  if (data[code + '-first-language']) {
    languages.push(data[code + '-first-language'])
  }

  if (data[code + '-second-language']) {
    languages.push(data[code + '-second-language'])
  }

  var schools = [];
  if (Array.isArray(data[code + '-locations'])) {
    data[code + '-locations'].forEach(name => {
      schools.push(data['schools'].find(school => school.name == name));
    });
  }

  if (schools.length == 0) {
    schools.push(data['schools'][0]);
  }

  var course = {
    "accrediting": data[code + '-accredited-body'] || data['training-provider-name'],
    "level": data[code + '-phase'],
    "sen": data[code + '-sen'],
    "subject": data[code + '-subject'],
    "secondSubject": data[code + '-second-subject'],
    "languages": languages,
    "name": data[code + '-title'] || data[code + '-generated-title'],
    "full-part": data[code + '-full-part'],
    "type": data[code + '-type'],
    "outcome": data[code + '-outcome'],
    "providerCode": data['provider-code'],
    "programmeCode": code,
    "schools": schools,
    "starts": data[code + '-start-date'],
    "minRequirements": data[code + '-min-requirements'],
    "options": [
      data[code + '-generated-description']
    ]
  };

  data['ucasCourses'].push(course);

  // "ucasCourses": [
  //   {
  //     "regions": "Eastern",
  //     "accrediting": "University of Hertfordshire",
  //     "subjects": "Art / art & design, Secondary",
  //     "ageRange": "Secondary (11+ years)",
  //     "name": "Art and Design",
  //     "slug": "art-and-design",
  //     "route": "Higher Education programme",
  //     "qualifications": "QTS, Postgraduate, Professional",
  //     "providerCode": "H36",
  //     "programmeCode": "W1X1",
  //     "schools": [
  //       {
  //         "name": "Main Site",
  //         "address": "",
  //         "code": ""
  //       }
  //     ],
  //     "options": [
  //       "PGCE with QTS full time"
  //     ]
  //   },

  res.redirect(`/course/${data['provider-code']}/${code}?created=true`);
})

router.all('/new/:code/:view', function (req, res) {
  var code = req.params.code;
  res.render(`new/${req.params.view}`, {code: code, paths: newCourseWizardPaths(req)})
})

router.all('/new/:code/further/:view', function (req, res) {
  var code = req.params.code;
  var locals = {
    code: code,
    paths: newFurtherEducationCourseWizardPaths(req)
  }

  res.render(`new/further/${req.params.view}`, locals, function(err, html) {
    if (err) {
      if (err.message.indexOf('template not found') !== -1) {
        return res.render(`new/${req.params.view}`, locals)
      }
      throw err;
    }
    res.send(html);
  });

  //res.render(`new/${req.params.view}`, {code: code, paths: newFurtherEducationCourseWizardPaths(req)})
})

router.post('/request-access', function (req, res) {
  res.render('request-access', { showMessage: true })
})

router.get('/about-your-organisation', function (req, res) {
  var errors = validateOrg(req.session.data);
  res.render('about-your-organisation', { errors: errors, justPublished: (req.query.publish && errors.length == 0) })
})

router.get('/about-your-organisation/edit', function (req, res) {
  var errors = validateOrg(req.session.data, 'about-your-organisation');
  res.render('about-your-organisation/edit', { errors: errors })
})

router.get('/about-your-organisation/contact', function (req, res) {
  var errors = validateOrg(req.session.data, 'contact-details');
  res.render('about-your-organisation/contact', { errors: errors })
})

router.post('/about-your-organisation', function (req, res) {
  req.session.data['about-your-organisation-publish-state'] = 'draft';
  res.render('about-your-organisation', { showMessage: true, publishState : 'draft' })
})

router.get('/preview/about-your-organisation', function (req, res) {
  res.render('preview-organisation-information')
})

router.get('/publish/about-your-organisation', function (req, res) {
  var errors = validateOrg(req.session.data);

  if (errors.length > 0) {
    req.session.data['about-your-organisation-show-publish-errors'] = errors.length > 0;
  } else {
    req.session.data['about-your-organisation-publish-state'] = 'published';
    req.session.data['about-your-organisation-published-before'] = true;
  }

  res.redirect('/about-your-organisation?publish=true');
})

// Publish course action
router.get('/publish/:providerCode/:code', function (req, res) {
  var c = course(req);
  var errors = validate(req.session.data, c);

  if (errors.length > 0) {
    req.session.data[c.programmeCode + '-show-publish-errors'] = errors.length > 0;
  } else {
    req.session.data[c.programmeCode + '-publish-state'] = 'published';
    req.session.data[c.programmeCode + '-published-before'] = true;
  }

  res.redirect('/course/' + req.params.providerCode + '/' + req.params.code + '?publish=true');
})

// Course page
router.get('/course/:providerCode/:code', function (req, res) {
  var c = course(req);
  var errors = validate(req.session.data, c);

  res.render('course', {
    course: c,
    errors: errors,
    justCreated: req.query.created,
    justPublished: (req.query.publish && errors.length == 0)
  })
})

// Post to course page
router.post('/course/:providerCode/:code', function (req, res) {
  var c = course(req);
  var data = req.session.data;
  var state = data[c.programmeCode + '-published-before'] ? 'published-with-changes' : 'draft'

  data[c.programmeCode + '-publish-state'] = state;

  res.render('course', {
    course: c,
    errors: validate(data, c),
    publishState : state,
    showMessage: true
  })
})

// Post to vacancies page
router.post('/course/:providerCode/:code/vacancies', function (req, res) {
  var c = course(req);
  var data = req.session.data;

  if (!data[course.programmeCode + '-multi-location'] && req.body[c.programmeCode + '-vacancies-choice'] == '_unchecked') {
    res.render('course/vacancies', {
      course: c,
      showErrors: true
    })
  } else {
    var choice = req.body[c.programmeCode + '-vacancies-choice'];
    if (Array.isArray(choice)) {
      choice = choice[0];
    }

    if (choice.includes('no vacancies')) {
      req.session.data[c.programmeCode + '-vacancies-flag'] = 'No';
    } else if (choice.includes('are vacancies')) {
      req.session.data[c.programmeCode + '-vacancies-flag'] = 'Yes';
    } else if (choice == 'There are some vacancies') {
      req.session.data[c.programmeCode + '-vacancies-flag'] = 'Yes';
    }
    res.redirect('/?editedVacancies=true')
  }
})

router.get('/course-not-running/:providerCode/:code', function (req, res) {
  var c = course(req);

  res.render('course-not-running', { course: c })
})

router.get('/preview/:providerCode/:code', function (req, res) {
  var c = course(req);
  var prefix = c.programmeCode;;

  res.render('preview', { course: c, prefix: prefix })
})

router.get('/course/:providerCode/:code/:view', function (req, res) {
  var view = req.params.view;
  var c = course(req);

  res.render(`course/${view}`, {
    course: c,
    errors: validate(req.session.data, c, view)
  })
})

router.get('/location/:id', function (req, res) {
  var school = req.session.data['schools'].find(function(school) {
    return school.code == req.params.id;
  });

  res.render('location', { school: school })
})

router.get('/location/:id/edit', function (req, res) {
  var school = req.session.data['schools'].find(function(school) {
    return school.id == req.params.id;
  });

  res.render('edit-location', { school: school })
})

module.exports = router
