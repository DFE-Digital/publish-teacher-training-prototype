function generateCourseCode() {
  var letters = 'ABCDEFGHJKMNPQRSTUVWXYZ'.split('');
  var letter = letters[ Math.floor(Math.random() * letters.length) ];
  var code = letter + Math.floor(Math.random()*(999 - 100 + 1) + 100);
  return code;
}

function generateLocationCode(exclude = []) {
  var letters = 'ABCDEFGHJKMNPQRSTUVWXYZ0123456789'.split('').filter( ( l ) => !exclude.includes( l ) );
  return letters[ Math.floor(Math.random() * letters.length) ];
}

function getGeneratedTitle(code, data) {
  var generatedTitle = data[code + '-subject'];

  if (data[code + '-second-subject']) {
    generatedTitle = `${generatedTitle} with ${data[code + '-second-subject']}`;
  }

  if (data[code + '-age-youngest']) {
    generatedTitle = `${generatedTitle} (${data[code + '-age-youngest']} – ${data[code + '-age-oldest']})`;
  }

  if (isModernLanguages(code, data)) {
    if (data[code + '-second-language']) {
      if (data[code + '-further-languages']) {
        generatedTitle = `${generatedTitle} (${data[code + '-first-language']}, ${data[code + '-second-language']}, ${data[code + '-further-languages'].join(', ')})`;
      } else {
        generatedTitle = `${generatedTitle} (${data[code + '-first-language']} and ${data[code + '-second-language']})`;
      }
    } else {
      generatedTitle = `${generatedTitle} (${data[code + '-first-language']})`;
    }
  }

  if (data[code + '-sen']) {
    generatedTitle = generatedTitle + ' (with Special educational needs and disability)';
  }

  data[code + '-generated-title'] = generatedTitle;
  return generatedTitle;
}

function originalQuery(req) {
  var originalQueryString = req.originalUrl.split('?')[1];
  return originalQueryString ? `?${originalQueryString}` : '';
}

function includeLocationsInWizard(data) {
  return data['schools'].length > 1;
}

function nextAndBackPaths(paths, currentPath, query, isModernLanguages = false) {
  var index = paths.indexOf(currentPath);
  var next = paths[index + 1] || '';
  var back = paths[index - 1] || '';

  if (back && back.includes('languages') && !isModernLanguages) {
    back = paths[index - 2];
  }

  return {
    next: /confirm|edit/.test(next) ? next : next + query,
    back: /confirm|edit/.test(back) ? back : back + query
  }
}

function newFurtherEducationCourseWizardPaths(req) {
  var code = req.params.code;
  var data = req.session.data;
  var editing = data['ucasCourses'].some(a => a.programmeCode == code);
  var summaryView = editing ? 'edit' : 'confirm';

  if (req.query.change && req.query.change != 'phase') {
    return {
      next: `/new/${code}/further/${summaryView}`,
      back: `/new/${code}/further/${summaryView}`
    }
  }

  var paths = [
    '/courses',
    `/new/${code}/phase`,
    `/new/${code}/further/title`,
    `/new/${code}/further/outcome`,
    `/new/${code}/further/full-time-part-time`,
    ...(includeLocationsInWizard(data) ? [`/new/${code}/further/training-locations`] : []),
    `/new/${code}/further/applications-open`,
    `/new/${code}/further/start-date`,
    `/new/${code}/further/${summaryView}`,
    `/new/${code}/further/create`
  ];

  var nextAndBack = nextAndBackPaths(paths, req.path, originalQuery(req));

  if (nextAndBack.back == '/courses?change=phase') {
    nextAndBack.back = `/new/${code}/further/${summaryView}`;
  }

  return nextAndBack;
}

function newCourseWizardPaths(req) {
  var data = req.session.data;
  var code = req.params.code;
  var editing = data['ucasCourses'].some(a => a.programmeCode == code);
  var summaryView = editing ? 'edit' : 'confirm';

  if (isFurtherEducation(code, data)) {
    return newFurtherEducationCourseWizardPaths(req);
  }

  if (req.query.change == 'subject') {
    return editSubjectPaths(req, summaryView);
  }

  if (req.query.change == 'languages') {
    return editLanguagePaths(req, summaryView);
  }

  if (req.query.change && req.query.change != 'phase') {
    return {
      next: `/new/${code}/${summaryView}`,
      back: `/new/${code}/${summaryView}`
    }
  }

  var paths = [
    '/courses',
    `/new/${code}/phase`,
    `/new/${code}/subject`,
    `/new/${code}/languages`,
    `/new/${code}/outcome`,
    ...(data['new-course']['include-fee-or-salary'] ? [`/new/${code}/funding`] : []),
    `/new/${code}/full-time-part-time`,
    ...(includeLocationsInWizard(data) ? [`/new/${code}/training-locations`] : []),
    ...(data['new-course']['include-accredited'] ? [`/new/${code}/accredited-body`] : []),
    `/new/${code}/eligibility`,
    `/new/${code}/applications-open`,
    `/new/${code}/start-date`,
    `/new/${code}/title`,
    `/new/${code}/${summaryView}`,
    `/new/${code}/create`
  ];

  var nextAndBack = nextAndBackPaths(paths, req.path, originalQuery(req), isModernLanguages(code, data));

  if (nextAndBack.back == '/courses?change=phase') {
    nextAndBack.back = `/new/${code}/${summaryView}`;
  }

  return nextAndBack;
}

function editSubjectPaths(req, summaryView = 'confirm') {
  var data = req.session.data;
  var code = req.params.code;
  var paths = [
    `/new/${code}/${summaryView}`,
    `/new/${code}/subject`,
    `/new/${code}/languages`,
    `/new/${code}/title`,
    `/new/${code}/${summaryView}`
  ];

  return nextAndBackPaths(paths, req.path, originalQuery(req), isModernLanguages(code, data));
}

function editLanguagePaths(req, summaryView = 'confirm') {
  var data = req.session.data;
  var code = req.params.code;
  var paths = [
    `/new/${code}/${summaryView}`,
    `/new/${code}/languages`,
    `/new/${code}/title`,
    `/new/${code}/${summaryView}`
  ];

  return nextAndBackPaths(paths, req.path, originalQuery(req), isModernLanguages(code, data));
}

function newLocationWizardPaths(req) {
  var code = req.params.code;
  var data = req.session.data;
  var editing = data['schools'].some(a => a.code == code);
  var summaryView = editing ? 'edit' : 'confirm';

  if (req.query.change && req.query.change != 'type') {
    return {
      next: `/new-location/${code}/${summaryView}`,
      back: `/new-location/${code}/${summaryView}`
    }
  }

  var paths = [
    '/locations',
    `/new-location/${code}/type`,
    `/new-location/${code}/pick-location`,
    `/new-location/${code}/${summaryView}`,
    `/new-location/${code}/create`
  ];

  var nextAndBack = nextAndBackPaths(paths, req.path, originalQuery(req));

  if (nextAndBack.back == '/locations?change=type') {
    nextAndBack.back = `/new-location/${code}/${summaryView}`;
  }

  return nextAndBack;
}

function getCourseOffered(code, data) {
  var courseOffered = data[code + '-outcome'] || '';

  if (courseOffered.includes('PGCE only')) {
    courseOffered = 'PGCE';
  }

  if (courseOffered.includes('PGDE only')) {
    courseOffered = 'PGDE';
  }

  if (data[code + '-full-part'] == 'Full time or part time') {
    courseOffered = courseOffered + ', full time or part time';
  } else if (data[code + '-full-part'])  {
    courseOffered = courseOffered + ' ' + data[code + '-full-part'].toLowerCase();
  }

  if (data[code + '-type'] == 'Salaried') {
    courseOffered = courseOffered + ' with salary';
  }

  if (data[code + '-type'] == 'Teaching apprenticeship') {
    courseOffered = courseOffered + ' teaching apprenticeship';
  }

  data[code + '-generated-description'] = courseOffered;
  return courseOffered;
}

function getLocationFromChoice(code, data) {
  var choice = data[code + '-location-picked'];
  var parts = choice.split(' (');
  var location = {
    name: parts[0]
  }

  location.urn = parts[1].split(',')[0];
  location.city = parts[1].split(',')[1];
  location.postcode = parts[1].split(',')[2].replace(')', '');

  return location;
}

function isModernLanguages(code, data) {
  return data[code + '-subject'] == 'Modern languages'
}

function isFurtherEducation(code, data) {
  return data[code + '-phase'] == 'Further education'
}

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

  course.path = `/course/${course.providerCode}/${course.programmeCode}`;
  course.salaried = (course.route == 'School Direct training programme (salaried)')
  return course;
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

  return errors.map(e => {
    e.text = e.title;
    e.href = course.path + e.link;

    return e;
  });
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

  return errors.map(e => {
    e.text = e.title;
    e.href = e.link;

    return e;
  });
}

module.exports = {
  generateCourseCode,
  generateLocationCode,
  getGeneratedTitle,
  getCourseOffered,
  getLocationFromChoice,
  isModernLanguages,
  isFurtherEducation,
  newCourseWizardPaths,
  newFurtherEducationCourseWizardPaths,
  newLocationWizardPaths,
  subject,
  course,
  validate,
  validateOrg
}
