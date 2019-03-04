const request = require("request")

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
    var languages = data[code + '-languages'] || [];
    if (languages.length == 1 || languages.length == 3) {
      generatedTitle = `${generatedTitle} (${languages.join(', ')})`;
    } else if (languages.length == 2) {
      generatedTitle = `${generatedTitle} (${languages[0]} and ${languages[1]})`;
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
    back: /confirm|edit/.test(back) ? back : back + query,
    current: /confirm|edit/.test(back) ? currentPath : currentPath + query,
  }
}

function rolloverWizardPaths(req) {
  var data = req.session.data;

  var paths = [
    '/',
    '/rollover/start',
    '/rollover/courses',
    '/rollover/locations',
    '/rollover/confirm',
    '/rollover/create'
  ];

  return nextAndBackPaths(paths, req.path, originalQuery(req));
}

function onboardingWizardPaths(req) {
  var data = req.session.data;

  var paths = [
    '/onboarding/accept-terms',
    '/onboarding/name',
    '/onboarding/code',
    '/onboarding/contact',
    '/onboarding/location',
    '/onboarding/request-access',
    '/onboarding/apply-settings',
    '/onboarding/gt12',
    '/onboarding/alerts',
    '/onboarding/ucas-contacts',
    '/'
  ];

  return nextAndBackPaths(paths, req.path, originalQuery(req));
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
    `/new/${code}/applications-open`,
    `/new/${code}/eligibility`,
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

  if (isRegionLocation(code, data)) {
    return newRegionLocationWizardPaths(req);
  }

  if (req.query.change == 'pick-location') {
    return editPickedLocationPaths(req, summaryView);
  }

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
    `/new-location/${code}/address`,
    `/new-location/${code}/${summaryView}`,
    `/new-location/${code}/create`
  ];

  var nextAndBack = nextAndBackPaths(paths, req.path, originalQuery(req));

  if (nextAndBack.back == '/locations?change=type') {
    nextAndBack.back = `/new-location/${code}/${summaryView}`;
  }

  return nextAndBack;
}

function newRegionLocationWizardPaths(req) {
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
    `/new-location/${code}/region-name`,
    `/new-location/${code}/region-schools`,
    `/new-location/${code}/${summaryView}`,
    `/new-location/${code}/create`
  ];

  var nextAndBack = nextAndBackPaths(paths, req.path, originalQuery(req));

  if (nextAndBack.back == '/locations?change=type') {
    nextAndBack.back = `/new-location/${code}/${summaryView}`;
  }

  return nextAndBack;
}

function editPickedLocationPaths(req, summaryView = 'confirm') {
  var data = req.session.data;
  var code = req.params.code;
  var paths = [
    `/new-location/${code}/${summaryView}`,
    `/new-location/${code}/pick-location`,
    `/new-location/${code}/address`,
    `/new-location/${code}/${summaryView}`
  ];

  return nextAndBackPaths(paths, req.path, originalQuery(req));
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

function getLocations(code, data, callback) {
  var promises = [];
  var choices = data[code + '-area-schools'];
  if (!Array.isArray(choices)) {
    choices = [choices];
  }

  choices.forEach(function(choice) {
    var p = new Promise(function(resolve, reject) {
              getLocationFromChoice(data, choice, function(location, urn) {
                resolve(location)
              })
            });
    promises.push(p);
  });

  Promise.all(promises).then(function(values) {
    callback(values);
  });
}

function getLocationFromChoice(data, choice, callback) {
  var parts = choice.split(' (');
  var urn = parts[1].split(',')[0];
  requestLocation(data, urn, callback);
}

function requestLocation(data, urn, callback) {
  if (data[urn]) {
    callback(data[urn]);
    return;
  }

  request({
      url: `https://raw.githubusercontent.com/fofr/schools-json/master/schools/${urn}.json`,
      json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var location = body;

      if (location.url && !location.url.startsWith('http')) {
        location.url = `http://${location.url}`;
      }

      data[urn] = location
      callback(location, urn);
    }
  })
}

function isModernLanguages(code, data) {
  return data[code + '-subject'] == 'Modern languages'
}

function isRegionLocation(code, data) {
  return data[code + '-location-type'] && data[code + '-location-type'].includes('A region or area')
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
  getLocations,
  isModernLanguages,
  isFurtherEducation,
  isRegionLocation,
  rolloverWizardPaths,
  onboardingWizardPaths,
  newCourseWizardPaths,
  newFurtherEducationCourseWizardPaths,
  newLocationWizardPaths,
  subject,
  course,
  validate,
  validateOrg
}
