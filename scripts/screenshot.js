// node scripts/screenshot.js directory-name-with-hyphens
var webshot = require('webshot');
var fs = require('fs');
var sharp = require('sharp');
var directoryName = process.argv.slice(-1)[0];

// var hostname = "localhost";
// var domain = `http://${hostname}:3000`;
var hostname = "bat-dev-manage-courses-ui-app.azurewebsites.net";
var domain = `https://${hostname}`;

if (directoryName.startsWith('/Users')) {
  console.log('No arguments set');
  console.log('Please set a screenshot directory in the format directory-name-with-hyphens');
  return;
}

var directory = 'app/assets/images/history/' + directoryName;
var indexDirectory = 'app/views/history/' + directoryName;
if ( ! fs.existsSync(directory)){
  fs.mkdirSync(directory);
  fs.mkdirSync(directory + '/thumbnails');
}

if ( ! fs.existsSync(indexDirectory)){
  fs.mkdirSync(indexDirectory);
}

var options = {
  phantomConfig: {
    'ignore-ssl-errors': 'true',
    'ssl-protocol': 'ANY'
  },
  windowSize: {
    width: 1200,
    height: 800
  },
  shotSize: {
    width: 'window',
    height: 'all'
  },
  cookies: [
    {
      'name': 'seen_cookie_message',
      'value': 'yes',
      'domain': hostname
    },
    {
      'name': '.AspNetCore.Cookies',
      'value': '',
      'domain': hostname
    },
    {
      'name': 'ARRAffinity',
      'value': '',
      'domain': hostname
    }
  ]
}

var paths = [
  { path: '/', name: 'organisation' }
  { path: '/organisation/2at/course/self/35l6/about', name: 'about-this-course' },
  { path: '/organisation/2at/course/self/35l6/fees-and-length', name: 'fees-and-length' },
  { path: '/organisation/2at/course/self/35l6/requirements', name: 'requirements-and-eligibility' },
  { path: '/organisation/2at/course/self/35l6/preview', name: 'preview' },
  { path: '/organisation/2at/about', name: 'about-your-organisation' },
  { path: '/organisation/2at/request-access', name: 'request-access' }
]

var template = '';
var contents = `
  {% set contents = [`;
var endContents = `
  ] %}
  {{ macros.screenshotContents(contents) }}
`;

paths.forEach(function(item, index) {
  var i = index + 1;
  var comma = index > 0 ? ', ': '';
  var indexStr = i < 10 ? '0' + i : i;
  var screenshot = directory + '/' + indexStr + '-' + item.name + '.png';
  var thumbnail = directory + '/thumbnails/' + indexStr + '-' + item.name + '.png';
  var heading = item.name.replace(/-/g, ' ');
  heading = heading.charAt(0).toUpperCase() + heading.slice(1)

  template += `
  {{ macros.screenshot('${heading}', '${item.name}', '${thumbnail.replace('app/assets', '/public')}', '${screenshot.replace('app/assets', '/public')}', '') }}
  `

  contents += `${comma}
    { text: '${heading}', id: '${item.name}' }`;

  webshot(domain + item.path, screenshot, options, function(err) {
    console.log(screenshot);
    sharp(screenshot).resize(630, null).toFile(thumbnail);
  });
});

var title = directoryName.replace(/-/g, ' ');
title = title.charAt(0).toUpperCase() + title.slice(1)

var templateStart = `
{% extends "layout.html" %}
{% set title = '${title}' %}
{% block page_title %}{{ title }}{% endblock %}

{% block content %}
<main id="content" role="main design-history">
  <div class="breadcrumbs dont-print">
    <ol>
      <li><a href="/history">Design history</a></li>
    </ol>
  </div>
  <h1 class="heading-xlarge">{{ title }}</h1>
`;

var templateEnd = `
</main>
{% endblock %}
`;

fs.writeFile(indexDirectory + "/index.html", templateStart + contents + endContents + template + templateEnd, function(err) {
  if (err) {
    return console.log(err);
  }
  console.log(`${indexDirectory}/index.html file generated.`);
});
