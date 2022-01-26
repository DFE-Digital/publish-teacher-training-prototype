// -------------------------------------------------------------------
// Imports and setup
// -------------------------------------------------------------------
const { DateTime } = require('luxon')

// Leave this filters line
const filters = {}

/* ------------------------------------------------------------------
 date filter for use in Nunjucks
 example: {{ params.date | date("DD/MM/YYYY") }}
 outputs: 01/01/1970
------------------------------------------------------------------ */
filters.date = (timestamp, format = 'yyyy-LL-dd') => {
  let datetime = DateTime.fromJSDate(timestamp, {
    locale: 'en-GB'
  }).toFormat(format)

  if (datetime === 'Invalid DateTime') {
    datetime = DateTime.fromISO(timestamp, {
      locale: 'en-GB'
    }).toFormat(format)
  }

  return datetime
}



// -------------------------------------------------------------------
// keep the following line to return your filters to the app
// -------------------------------------------------------------------
exports.filters = filters
