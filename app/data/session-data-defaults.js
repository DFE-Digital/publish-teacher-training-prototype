const cycles = require('../helpers/cycles')

let defaults = {}

defaults.currentCycle = cycles.CURRENT_CYCLE
defaults.previousCycle = cycles.PREVIOUS_CYCLE
defaults.nextCycle = cycles.NEXT_CYCLE

// defaults.courses = require('./courses')
// defaults.courseLocations = require('./course-locations')
// defaults.courseSubjects = require('./course-subjects')
// defaults.locations = require('./locations')
// defaults.organisations = require('./organisations')
defaults.subjects = require('./subjects')
// defaults.users = require('./users')

module.exports = defaults
