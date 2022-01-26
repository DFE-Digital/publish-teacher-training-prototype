const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const individualFiltersFolder = path.join(__dirname, './filters')

module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {}

  // Import filters from filters folder
  if (fs.existsSync(individualFiltersFolder)) {
    var files = fs.readdirSync(individualFiltersFolder)
    files.forEach(file => {
      let fileData = require(path.join(individualFiltersFolder, file))
      // Loop through each exported function in file (likely just one)
      Object.keys(fileData).forEach((filterGroup) => {
        // Get each method from the file
        Object.keys(fileData[filterGroup]).forEach(filterName => {
          filters[filterName] = fileData[filterGroup][filterName]
        })
      })
    })
  }

  filters.includes = (route, string) =>{
    if (route && route.includes(string)) {
      return true
    } else {
      return false
    }
  }

  /* ------------------------------------------------------------------
  utility function to return true or false
  example: {{ 'yes' | falsify }}
  outputs: true
  ------------------------------------------------------------------ */
  filters.falsify = (input) => {
    if (_.isNumber(input)) return input
    else if (input == false) return false
    if (_.isString(input)){
      const truthyValues = ['yes','true']
      const falsyValues = ['no', 'false']
      if (truthyValues.includes(input.toLowerCase())) return true
      else if (falsyValues.includes(input.toLowerCase())) return false
    }
    return input
  }

  /* ------------------------------------------------------------------
  utility function to get an error for a component
  example: {{ errors | getErrorMessage('title') }}
  outputs: "Enter a title"
  ------------------------------------------------------------------ */
  filters.getErrorMessage = function (array, fieldName) {
    if (!array || !fieldName) {
      return null
    }

    const error = array.filter((obj) =>
      obj.fieldName === fieldName
    )[0]

    return error
  }

  // filters.addMoreToFields = function (fields, more) {
  //   fields.forEach(f => {
  //     f.more = more
  //   })
  //
  //   return fields
  // }
  //
  // filters.push = (array, item) => {
  //   array.push(item)
  //   return array
  // }
  //
  // /**
  //  * Convert array to readable list format
  //  * @param {Array} array Array to convert
  //  * @example [A, B, C] => A, B and C
  //  */
  // filters.formatList = (array = []) => {
  //   const lf = new Intl.ListFormat('en')
  //   return lf.format(array)
  // }
  //
  // /**
  //  * Convert array to readable list format
  //  * @param {Array} array Array to convert
  //  * @example [A, B, C] => A, B or C
  //  */
  // filters.formatOrList = (array = []) => {
  //   const lf = new Intl.ListFormat('en', { style: 'short', type: 'disjunction' })
  //   return lf.format(array)
  // }
  //
  // /**
  //  * Find item in array of objects
  //  * @param {Array} array Array to search
  //  * @param {string} key Key
  //  * @param {value} value Value
  //  */
  // filters.find = (array, key, value) => {
  //   return array.find(item => item[key] === value)
  // }

  /* ------------------------------------------------------------------
    add your methods to the filters obj below this comment block:
    @example:

    filters.sayHi = function(name) {
        return 'Hi ' + name + '!'
    }

    Which in your templates would be used as:

    {{ 'Paul' | sayHi }} => 'Hi Paul'

    Notice the first argument of your filters method is whatever
    gets 'piped' via '|' to the filter.

    Filters can take additional arguments, for example:

    filters.sayHi = function(name,tone) {
      return (tone == 'formal' ? 'Greetings' : 'Hi') + ' ' + name + '!'
    }

    Which would be used like this:

    {{ 'Joel' | sayHi('formal') }} => 'Greetings Joel!'
    {{ 'Gemma' | sayHi }} => 'Hi Gemma!'

    For more on filters and how to write them see the Nunjucks
    documentation.

  ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
