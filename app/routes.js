var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  if (req.session.data['multi-organisation']) {
    res.render('your-organisations');
  } else {
    res.render('organisation');
  }
})

router.get('/new/start', function (req, res) {
  var code = generateCourseCode();
  res.redirect('/new/' + code + '/phase');
})

router.all('/new/:code/training-locations', function (req, res) {
  var data = req.session.data;
  var code = req.params.code;
  var locations = [];

  data['schools'].forEach(school => {
    locations.push({
      name: school.name,
      text: school.address
    });
  });

  res.render('new/training-locations', {
    code: code,
    paths: newCourseWizardPaths(req.path, code, data),
    locations: locations
  });
})

router.all('/new/:code/confirm', function (req, res) {
  var data = req.session.data;
  var code = req.params.code;

  res.render('new/confirm', {
    code: code,
    paths: newCourseWizardPaths(req.path, code, data),
    generatedTitle: getGeneratedTitle(code, data),
    courseOffered: getCourseOffered(code, data)
  });
})

function generateCourseCode() {
  var letters = 'ABCDEFGHJKMNPQRSTUVWXYZ'.split('');
  var letter = letters[ Math.floor(Math.random() * letters.length) ];
  var code = letter + Math.floor(Math.random()*(999 - 100 + 1) + 100);
  return code;
}

function getGeneratedTitle(code, data) {
  var generatedTitle = data[code + '-new-subject'];

  if (isModernLanguages(code, data)) {
    if (data[code + '-new-second-language']) {
      generatedTitle = `${generatedTitle} (${data[code + '-new-first-language']} and ${data[code + '-new-second-language']})`;
    } else {
      generatedTitle = `${generatedTitle} (${data[code + '-new-first-language']})`;
    }
  }

  if (data[code + '-new-sen']) {
    generatedTitle = generatedTitle + ' (with Special educational needs)';
  }

  data[code + '-new-generated-title'] = generatedTitle;
  return generatedTitle;
}

function newCourseWizardPaths(currentPath, code, data) {
  var paths = [
    '/',
    `/new/${code}/phase`,
    `/new/${code}/subject`,
    `/new/${code}/languages`,
    `/new/${code}/outcome`,
    ...(data['new-course']['include-fee-or-salary'] ? [`/new/${code}/funding`] : []),
    `/new/${code}/full-time-part-time`,
    ...(data['new-course']['include-locations'] ? [`/new/${code}/training-locations`] : []),
    ...(data['new-course']['include-accredited'] ? [`/new/${code}/accredited-provider`] : []),
    `/new/${code}/confirm`,
    `/new/${code}/create`
  ];
  var index = paths.indexOf(currentPath);
  var next = paths[index + 1];
  var back = paths[index - 1];

  if (back == `/new/${code}/languages` && !isModernLanguages(code, data)) {
    back = paths[index - 2];
  }

  return {
    next: next,
    back: back
  }
}

function getCourseOffered(code, data) {
  var courseOffered = data[code + '-new-outcome'];

  if (data[code + '-new-full-part'] == 'Full time or part time') {
    courseOffered = courseOffered + ', full time or part time';
  } else if (data[code + '-new-full-part'])  {
    courseOffered = courseOffered + ' ' + data[code + '-new-full-part'].toLowerCase();
  }

  if (data[code + '-new-type'] == 'Salaried') {
    courseOffered = courseOffered + ' with salary';
  }

  if (data[code + '-new-type'] == 'Teaching apprenticeship') {
    courseOffered = courseOffered + ' teaching apprenticeship';
  }

  data[code + '-new-generated-description'] = courseOffered;
  return courseOffered;
}

function isModernLanguages(code, data) {
  return data[code + '-new-subject'] == 'Modern languages'
}

router.post('/new/:code/languages', function (req, res) {
  var code = req.params.code;
  var data = req.session.data;

  if (isModernLanguages(code, data)) {
    res.render('new/languages', {
      code: code,
      paths: newCourseWizardPaths(req.path, code, data)
    });
  } else {
    res.redirect('/new/' + code + '/outcome');
  }
})

router.all('/new/:code/create', function (req, res) {
  // Take new data and make it into a course
  var data = req.session.data;
  var code = req.params.code;
  var languages = [];

  if (data[code + '-new-first-language']) {
    languages.push(data[code + '-new-first-language'])
  }

  if (data[code + '-new-second-language']) {
    languages.push(data[code + '-new-second-language'])
  }

  var course = {
    "accrediting": data[code + '-new-accredited-provider'] || data['training-provider-name'],
    "level": data[code + '-new-phase'],
    "sen": data[code + '-new-sen'],
    "subject": data[code + '-new-subject'],
    "languages": languages,
    "name": data[code + '-new-title'] || data[code + '-new-generated-title'],
    "full-part": data[code + '-new-full-part'],
    "type": data[code + '-new-type'],
    "slug": "new-course",
    "route": "New",
    "outcome": data[code + '-new-outcome'],
    "providerCode": data['provider-code'],
    "programmeCode": req.params.code,
    "schools": [

    ],
    "options": [
      data[code + '-new-generated-description']
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

  // "new-phase": "Secondary",
  // "new-type": "Salaried",
  // "new-subject": "Modern languages",
  // "new-first-language": "French",
  // "new-second-language": "German",
  // "new-further-languages": "This course has more languages",
  // "new-outcome": "PGCE with QTS",
  // "new-full-part": "Full time",
  // "new-has-accredited-provider": "No, we are the accredited provider",

  res.redirect(`/course/${data['provider-code']}/${req.params.code}?created=true`);
})

router.all('/new/:code/:view', function (req, res) {
  var code = req.params.code;
  res.render(`new/${req.params.view}`, {code: code, paths: newCourseWizardPaths(req.path, code, req.session.data)})
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
  req.session.data[c.programmeCode + '-publish-state'] = 'draft';

  res.render('course', {
    course: c,
    errors: validate(req.session.data, c),
    publishState : 'draft',
    showMessage: true
  })
})

router.get('/course-not-running/:providerCode/:code', function (req, res) {
  var c = course(req);

  res.render('course-not-running', { course: c })
})

router.get('/preview/:providerCode/:code', function (req, res) {
  var c = course(req);
  var prefix = '';

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

function subject(req) {
  var accrediting = accreditor(req);
  var subject = accrediting['subjects'].find(function(s) {
    return s.slug == req.params.subject;
  })

  return {
    name: subject.name,
    slug: subject.slug
  };
}

function course(req) {
  var course = req.session.data['ucasCourses'].find(function(a) {
    return a.programmeCode == req.params.code;
  });

  course.salaried = (course.route == 'School Direct training programme (salaried)')
  return course;
}

function option(req, subject) {
  var optionIndex = req.params.index;
  var folded_course = subject.folded_course;
  var name = folded_course['options'][optionIndex - 1];

  return {
    name: name,
    index: optionIndex,
    salaried: name.includes('salary'),
    partTime: name.includes('part'),
    qtsOnly: !name.includes('PGCE')
  };
}

function validate(data, course, view) {
  var prefix = course.programmeCode;
  var view = view || 'all';
  var errors = [];

  if (view == 'all' || view == 'about-this-course') {
    if (!data[prefix + '-about-this-course']) {
      errors.push({
        title: 'Give details about this course',
        id: `${prefix}-about-this-course`,
        link: `/about-this-course#${prefix}-about-this-course`,
        page: 'about-this-course'
      })
    }

    if (!data[prefix + '-placement-school-policy']) {
      errors.push({
        title: 'Give details about how school placements work',
        id: `${prefix}-placement-school-policy`,
        link: `/about-this-course#${prefix}-placement-school-policy`,
        page: 'about-this-course'
      })
    }
  }

  if (view == 'all' || view == 'requirements') {
    if (!data[prefix + '-qualifications-required']) {
      errors.push({
        title: 'Give details about the qualifications needed',
        id: `${prefix}-qualifications-required`,
        link: `/requirements#${prefix}-qualifications-required`,
        page: 'requirements'
      })
    }
  }

  if (view == 'all' || view == 'fees-and-length') {
    if (!data[prefix + '-duration']) {
      errors.push({
        title: 'Enter a course length',
        id: `${prefix}-duration`,
        link: `/fees-and-length#${prefix}-duration`,
        page: 'fees-and-length'
      })
    }

    if (!course.salaried && !data[prefix + '-fee']) {
      errors.push({
        title: 'Enter course fees for UK and EU students',
        id: `${prefix}-fee`,
        link: `/fees-and-length#${prefix}-fee`,
        page: 'fees-and-length'
      })
    }

    if (course.salaried && !data[prefix + '-salary-details']) {
      errors.push({
        title: 'Give details about the salary for this course',
        id: `${prefix}-salary-details`,
        link: `/fees-and-length#${prefix}-salary-details`,
        page: 'fees-and-length'
      })
    }
  }

  return errors;
}

function validateOrg(data, view) {
  var errors = [];
  var view = view || 'all';

  if (view == 'all' || view == 'about-your-organisation') {
    if (!data['about-organisation']) {
      errors.push({
        title: 'Give details about your organisation',
        id: `about-organisation`,
        link: `/about-your-organisation/edit#about-organisation`,
        page: 'about-your-organisation'
      })
    }

    if (!data['training-with-a-disability']) {
      errors.push({
        title: 'Give details about training with a disability',
        id: `training-with-a-disability`,
        link: `/about-your-organisation/edit#training-with-a-disability`,
        page: 'about-your-organisation'
      })
    }
  }

  if (view == 'all' || view == 'contact-details') {
    if (!data['email-address']) {
      errors.push({
        title: 'Email address is missing',
        id: `email-address`,
        link: `/about-your-organisation/contact#email-address`,
        page: 'contact'
      })
    }

    if (!data['telephone-number']) {
      errors.push({
        title: 'Telephone number is missing',
        id: `telephone-number`,
        link: `/about-your-organisation/contact#telephone-number`,
        page: 'contact'
      })
    }

    if (!data['website']) {
      errors.push({
        title: 'Website is missing',
        id: `website`,
        link: `/about-your-organisation/contact#website`,
        page: 'contact'
      })
    }

    if (!data['building-and-street']) {
      errors.push({
        title: 'Give a building and street name in your contact address',
        id: `building-and-street`,
        link: `/about-your-organisation/contact#building-and-street`,
        page: 'contact'
      })
    }

    if (!data['organisation-town-or-city']) {
      errors.push({
        title: 'Give a town or city in your contact address',
        id: `organisation-town-or-city`,
        link: `/about-your-organisation/contact#organisation-town-or-city`,
        page: 'contact'
      })
    }

    if (!data['postcode']) {
      errors.push({
        title: 'Give a postcode in your contact address',
        id: `postcode`,
        link: `/about-your-organisation/contact#postcode`,
        page: 'contact'
      })
    }

    if (!data['county']) {
      errors.push({
        title: 'Give a county in your contact address',
        id: `county`,
        link: `/about-your-organisation/contact#county`,
        page: 'contact'
      })
    }
  }

  return errors;
}


// router.get('/email-qa-pass/:subject', function (req, res) {
//   res.render('email-qa-pass', { subject: subject(req) })
// })
//
// router.get('/email-qa-fail/:subject', function (req, res) {
//   res.render('email-qa-fail', { subject: subject(req) })
// })

module.exports = router
