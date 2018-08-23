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

router.post('/request-access', function (req, res) {
  res.render('request-access', { showMessage: true })
})

router.get('/about-your-organisation', function (req, res) {
  var errors = validateOrg(req.session.data);
  res.render('about-your-organisation', { errors: errors, justPublished: (req.query.publish && errors.length == 0) })
})

router.get('/about-your-organisation/edit', function (req, res) {
  var errors = validateOrg(req.session.data);
  res.render('about-your-organisation/edit', { errors: errors, justPublished: (req.query.publish && errors.length == 0) })
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

// router.post('/template/new', function (req, res) {
//   var name = req.body['template-name'];
//   var slug = name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/-$/g, '').toLowerCase();
//
//   req.session.data['templates'].push({
//     name: name,
//     slug: slug
//   });
//
//   res.redirect('/template/' + slug);
// })
//
// router.get('/template/new', function (req, res) {
//   res.render('template/new');
// })
//
// router.get('/template/:template', function (req, res) {
//   res.render('template/fields', { template: template(req) })
// })
//
// router.get('/template/:template/:view', function (req, res) {
//   var view = req.params.view;
//   res.render(`template/${view}`, { template: template(req) })
// })
//
// router.post('/template/:template/apply', function (req, res) {
//
//   for (choice in req.body) {
//     if (req.body[choice] != '_unchecked') {
//       var code = choice.replace('apply-to-', '');
//       req.session.data[code + '-template-choice'] = req.params.template;
//     }
//   }
//
//   res.redirect(`/template/${req.params.template}/apply`)
// })
//
// router.get('/preview/template/:template', function (req, res) {
//   var t = template(req);
//   var c = {
//     name: 'Example subject'
//   }
//
//   var a = {
//     name: 'Example Accrediting Provider'
//   }
//
//   res.render('preview', { course: c, accrediting: a, template: t, prefix: t.slug + '-template', previewingTemplate: true })
// })

// Publish course action
router.get('/publish/:accreditor/:code', function (req, res) {
  var c = course(req);
  var errors = validate(req.session.data, c);

  if (errors.length > 0) {
    req.session.data[c.programmeCode + '-show-publish-errors'] = errors.length > 0;
  } else {
    req.session.data[c.programmeCode + '-publish-state'] = 'published';
    req.session.data[c.programmeCode + '-published-before'] = true;
  }

  res.redirect('/course/' + req.params.accreditor + '/' + req.params.code + '?publish=true');
})

// Course page
router.get('/course/:accreditor/:code', function (req, res) {
  var c = course(req);
  var errors = validate(req.session.data, c);

  res.render('course', {
    course: c,
    accrediting: accreditor(req),
    template: template(req, c),
    errors: errors,
    justPublished: (req.query.publish && errors.length == 0)
  })
})

// Post to course page
router.post('/course/:accreditor/:code', function (req, res) {
  var c = course(req);
  req.session.data[c.programmeCode + '-publish-state'] = 'draft';

  res.render('course', {
    course: c,
    accrediting: accreditor(req),
    template: template(req, c),
    errors: validate(req.session.data, c),
    publishState : 'draft',
    showMessage: true
  })
})

router.get('/course-not-running/:accreditor/:code', function (req, res) {
  var c = course(req);

  res.render('course-not-running', { course: c, accrediting: accreditor(req), template: template(req, c) })
})

router.get('/preview/:accreditor/:code', function (req, res) {
  var c = course(req);
  var t = template(req, c);
  var prefix = '';

  if (t) {
    prefix = t.slug + '-template';
  } else {
    prefix = c.programmeCode;
  }

  res.render('preview', { course: c, accrediting: accreditor(req), template: t, prefix: prefix })
})

// router.get('/course/:accreditor/:code/no-template', function (req, res) {
//   req.session.data[req.params.code + '-template-choice'] = 'template-none';
//   res.redirect(`/course/${req.params.accreditor}/${req.params.code}`);
// })

router.get('/course/:accreditor/:code/:view', function (req, res) {
  var view = req.params.view;
  var c = course(req);

  res.render(`course/${view}`, {
    course: c,
    accrediting: accreditor(req),
    errors: validate(req.session.data, c, view)
  })
})

// router.get('/school/:id', function (req, res) {
//   var school = req.session.data['schools'].find(function(school) {
//     return school.code == req.params.id;
//   });
//
//   res.render('school', { school: school })
// })
//
// router.get('/school/:id/edit', function (req, res) {
//   var school = req.session.data['schools'].find(function(school) {
//     return school.id == req.params.id;
//   });
//
//   res.render('edit-school', { school: school })
// })

function subject(req) {
  var accrediting = accreditor(req);
  var subject = accrediting['subjects'].find(function(s) {
    return s.slug == req.params.subject;
  })

  var folded_course = req.session.data['folded_courses'][accrediting['name']].find(function(folded_course) {
    return folded_course.name == subject.name;
  });

  return {
    name: subject.name,
    slug: subject.slug,
    folded_course: folded_course
  };
}

function course(req) {
  var course = req.session.data['ucasCourses'].find(function(a) {
    return a.programmeCode == req.params.code;
  });

  course.salaried = (course.route == 'School Direct training programme (salaried)')
  return course;
}

function accreditor(req) {
  var accreditor = req.session.data['accreditors'].find(function(a) {
    return a.slug == req.params.accreditor;
  });

  accreditor.selfAccrediting = (req.session.data['training-provider-name'] == accreditor.name);

  return accreditor;
}

function template(req, course) {
  var templateSlug;

  if (req.params.template) {
    templateSlug = req.params.template
  } else if (course) {
    templateSlug = req.session.data[course.programmeCode + '-template-choice'];
  }

  return req.session.data['templates'].find(function(t) {
    return t.slug == templateSlug;
  });
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

function validateOrg(data) {
  var errors = [];

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
